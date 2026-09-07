import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let settings = await prisma.globalSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.globalSetting.create({
        data: { id: 'default' },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const updated = await prisma.globalSetting.upsert({
      where: { id: 'default' },
      update: {
        hospitalName: data.hospitalName,
        tagline: data.tagline,
        phone: data.phone,
        emergencyPhone: data.emergencyPhone,
        ambulancePhone: data.ambulancePhone,
        email: data.email,
        address: data.address,
        openingHours: data.openingHours,
        announcementText: data.announcementText,
        announcementActive: data.announcementActive,
        emergencyBannerActive: data.emergencyBannerActive,
        emergencyBannerText: data.emergencyBannerText,
        copyright: data.copyright,
        facebook: data.facebook,
        twitter: data.twitter,
        instagram: data.instagram,
        linkedin: data.linkedin,
        youtube: data.youtube,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userName: data.updatedBy || 'Hospital Administrator',
        action: 'Updated Settings',
        module: 'Global Settings',
        details: 'Hospital contact information and announcement updated.',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
