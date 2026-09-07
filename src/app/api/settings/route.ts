import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

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

    return NextResponse.json(settings, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500, headers: noCacheHeaders });
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
        logoUrl: data.logoUrl,
        phone: data.phone,
        emergencyPhone: data.emergencyPhone,
        ambulancePhone: data.ambulancePhone,
        email: data.email,
        address: data.address,
        openingHours: data.openingHours,
        googleMapsUrl: data.googleMapsUrl,
        whatsapp: data.whatsapp,
        announcementText: data.announcementText,
        announcementActive: data.announcementActive !== undefined ? Boolean(data.announcementActive) : true,
        emergencyBannerActive: data.emergencyBannerActive !== undefined ? Boolean(data.emergencyBannerActive) : true,
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
        details: `Hospital info updated: ${updated.hospitalName}`,
      },
    }).catch(() => {});

    // Invalidate caches everywhere across the app
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/admin/global-content');
      revalidatePath('/admin/settings');
      revalidatePath('/contact');
      revalidatePath('/emergency');
    } catch (e) {
      console.warn('Revalidate notice:', e);
    }

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500, headers: noCacheHeaders });
  }
}

