import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const defaultSeoPages = [
  {
    pagePath: '/',
    metaTitle: 'MedicalPress Hospital | Advanced Healthcare & Compassionate Care',
    metaDescription: 'Leading international multi-specialty hospital providing 24/7 trauma emergency, advanced surgery, cardiology, and digital appointments.',
    keywords: 'hospital, healthcare, emergency, doctor appointment, cardiology, neurology',
    ogImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    robots: 'index, follow',
    schemaType: 'Hospital',
  },
  {
    pagePath: '/appointment',
    metaTitle: 'Book Doctor Appointment Online | MedicalPress Hospital',
    metaDescription: 'Instant online doctor consultation and clinic appointment booking with real-time schedule slots and printable confirmation.',
    keywords: 'book appointment, doctor booking, hospital schedule, online consultation',
    ogImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    robots: 'index, follow',
    schemaType: 'MedicalWebPage',
  },
  {
    pagePath: '/doctors',
    metaTitle: 'Meet Our Specialist Doctors | MedicalPress Medical Team',
    metaDescription: 'Browse board-certified doctors, surgeons, cardiologists, pediatricians, and oncologists at MedicalPress Hospital.',
    keywords: 'specialist doctors, surgeons, physicians, cardiologists, pediatricians',
    ogImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200',
    robots: 'index, follow',
    schemaType: 'MedicalWebPage',
  },
  {
    pagePath: '/departments',
    metaTitle: 'Clinical Departments & Centers of Excellence | MedicalPress',
    metaDescription: 'Explore our specialized clinical departments including Cardiology, Neurology, Orthopedics, Pediatrics, and Oncology.',
    keywords: 'cardiology department, neurology center, surgical department, oncology hospital',
    ogImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    robots: 'index, follow',
    schemaType: 'MedicalWebPage',
  },
  {
    pagePath: '/emergency',
    metaTitle: '24/7 Emergency & Level 1 Trauma Center | MedicalPress Hospital',
    metaDescription: 'Immediate life-saving emergency care, critical trauma team, ICU ambulances, and rapid cardiac resuscitation.',
    keywords: 'emergency room, ER hospital, 24/7 emergency, trauma center, ambulance hotline',
    ogImage: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=1200',
    robots: 'index, follow',
    schemaType: 'EmergencyService',
  },
  {
    pagePath: '/patient-portal',
    metaTitle: 'Patient Portal — E-Prescriptions & Diagnostic Reports | MedicalPress',
    metaDescription: 'Secure digital patient portal to access doctor prescriptions, laboratory diagnostic reports, and medical visit history.',
    keywords: 'patient portal, medical records, diagnostic test results, digital prescription',
    ogImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    robots: 'noindex, nofollow',
    schemaType: 'MedicalWebPage',
  },
];

export async function GET() {
  try {
    let pages = await prisma.seoSetting.findMany({
      orderBy: { pagePath: 'asc' },
    });

    if (pages.length === 0) {
      for (const p of defaultSeoPages) {
        await prisma.seoSetting.create({ data: p });
      }
      pages = await prisma.seoSetting.findMany({
        orderBy: { pagePath: 'asc' },
      });
    }

    return NextResponse.json(pages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { pagePath, metaTitle, metaDescription, keywords, ogImage, robots, schemaType } = data;

    if (!pagePath || !metaTitle || !metaDescription) {
      return NextResponse.json({ error: 'Page path, meta title, and description are required.' }, { status: 400 });
    }

    const updated = await prisma.seoSetting.upsert({
      where: { pagePath },
      update: {
        metaTitle,
        metaDescription,
        keywords: keywords || '',
        ogImage: ogImage || '',
        robots: robots || 'index, follow',
        schemaType: schemaType || 'MedicalWebPage',
      },
      create: {
        pagePath,
        metaTitle,
        metaDescription,
        keywords: keywords || '',
        ogImage: ogImage || '',
        robots: robots || 'index, follow',
        schemaType: schemaType || 'MedicalWebPage',
      },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Hospital Administrator',
        action: 'Updated SEO Meta',
        module: 'SEO Settings',
        recordId: updated.id,
        details: `Updated metadata for route: ${pagePath}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save SEO setting' }, { status: 500 });
  }
}
