import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Please provide name, email, and message.' }, { status: 400 });
    }

    // 1. Save contact message
    const msg = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || 'General Inquiry',
        message: body.message,
        status: 'New',
      },
    });

    // 2. Automatically capture CRM lead
    await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || 'Not Provided',
        source: 'Contact Form',
        interestedService: body.subject || 'General Healthcare Inquiry',
        status: 'New',
        notes: body.message,
      },
    });

    // 3. Create notification for admin panel
    await prisma.notification.create({
      data: {
        title: 'New Contact Inquiry Received',
        message: `Inquiry from ${body.name}: "${(body.subject || 'Contact message').slice(0, 30)}..."`,
        type: 'Lead',
        link: '/admin/leads',
      },
    });

    return NextResponse.json({ success: true, message: 'Your message has been received.' });
  } catch (error: any) {
    console.error('Failed to submit contact message:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
