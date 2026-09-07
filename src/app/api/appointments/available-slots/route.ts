import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const dateStr = searchParams.get('date'); // YYYY-MM-DD

    if (!doctorId || !dateStr) {
      return NextResponse.json({ error: 'doctorId and date are required' }, { status: 400 });
    }

    const targetDate = new Date(dateStr + 'T00:00:00');
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // 1. Check if doctor is on leave
    const leave = await prisma.doctorLeave.findFirst({
      where: {
        doctorId,
        status: 'Approved',
        startDate: { lte: dateStr },
        endDate: { gte: dateStr },
      },
    });

    if (leave) {
      return NextResponse.json({
        available: false,
        message: `Doctor is on approved leave on ${dateStr} (${leave.reason}).`,
        slots: [],
      });
    }

    // 2. Check if hospital holiday
    const holiday = await prisma.holiday.findFirst({
      where: {
        startDate: { lte: dateStr },
        endDate: { gte: dateStr },
      },
    });

    if (holiday) {
      return NextResponse.json({
        available: false,
        message: `Hospital outpatient clinic is closed on this date (${holiday.name}).`,
        slots: [],
      });
    }

    // 3. Check doctor schedule for this day of week
    const schedules = await prisma.schedule.findMany({
      where: {
        doctorId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (schedules.length === 0) {
      // Return helpful message and default consultation window if doctor doesn't have custom day schedule
      const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
      return NextResponse.json({
        available: false,
        message: `Dr. ${doctor?.name || 'Doctor'} does not hold regular clinic on this day of week. Visiting hours are: ${doctor?.visitingHours || 'Mon, Wed, Fri'}.`,
        slots: [],
      });
    }

    // 4. Fetch booked appointments for this doctor and date
    const existingBookings = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: dateStr,
        status: { notIn: ['Cancelled'] },
      },
      select: { timeSlot: true },
    });

    const bookedTimes = new Set(existingBookings.map((b) => b.timeSlot.trim().toUpperCase()));

    // 5. Generate time slots from schedule intervals
    const generatedSlots: { time: string; isAvailable: boolean }[] = [];

    for (const sch of schedules) {
      const [startHour, startMin] = sch.startTime.split(':').map(Number);
      const [endHour, endMin] = sch.endTime.split(':').map(Number);
      const slotMinutes = sch.slotDuration || 30;

      let currentMinTotal = startHour * 60 + startMin;
      const endMinTotal = endHour * 60 + endMin;

      while (currentMinTotal < endMinTotal) {
        const hour = Math.floor(currentMinTotal / 60);
        const min = currentMinTotal % 60;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayMin = min < 10 ? `0${min}` : `${min}`;
        const slotString = `${displayHour < 10 ? '0' + displayHour : displayHour}:${displayMin} ${period}`;

        const isBooked = bookedTimes.has(slotString.toUpperCase());

        generatedSlots.push({
          time: slotString,
          isAvailable: !isBooked,
        });

        currentMinTotal += slotMinutes;
      }
    }

    return NextResponse.json({
      available: true,
      slots: generatedSlots,
    });
  } catch (error) {
    console.error('Failed to calculate slots:', error);
    return NextResponse.json({ error: 'Failed to calculate available slots' }, { status: 500 });
  }
}
