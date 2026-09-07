import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, category } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: {
        email,
        category: category || 'All Updates',
        isActive: true,
      },
    });

    // Capture as CRM lead
    await prisma.lead.upsert({
      where: { id: `lead-news-${email}` },
      update: { status: 'New' },
      create: {
        id: `lead-news-${email}`,
        name: email.split('@')[0],
        email,
        phone: 'N/A',
        source: 'Newsletter',
        interestedService: 'Health Tips & Updates',
        status: 'New',
        notes: 'Subscribed to MedicalPress weekly newsletter.',
      },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Subscription failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
