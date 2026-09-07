import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const defaultMediaPresets = [
  {
    title: 'Hospital Main Campus Facade',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200',
    description: 'Front view of MedicalPress tertiary care facility',
  },
  {
    title: 'Hybrid Operating Theater',
    category: 'Surgeries',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200',
    description: 'Ultra-clean laminar flow surgical theater',
  },
  {
    title: 'Siemens 3T MRI Imaging Center',
    category: 'Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    description: 'High-field MRI diagnostic imaging suite',
  },
  {
    title: 'Intensive Cardiac Care Unit (ICCU)',
    category: 'Wards',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    description: 'State-of-the-art continuous patient monitoring beds',
  },
  {
    title: 'Senior Cardiology Team Consultation',
    category: 'Staff',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200',
    description: 'Interdisciplinary medical specialists round',
  },
  {
    title: 'Critical Care ICU Ambulance',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=1200',
    description: 'Mobile resuscitation and ventilator unit',
  },
  {
    title: 'Pediatric Care Ward',
    category: 'Wards',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    description: 'Child-friendly recovery rooms and nursing support',
  },
  {
    title: 'Automated Diagnostic Laboratory',
    category: 'Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    description: 'Fully automated biochemistry and hematology analyzers',
  },
];

export async function GET() {
  try {
    let items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (items.length === 0) {
      for (const item of defaultMediaPresets) {
        await prisma.galleryItem.create({ data: item });
      }
      items = await prisma.galleryItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, category, imageUrl, caption, description } = data;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 });
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        category: category || 'General',
        imageUrl,
        description: description || caption || '',
      },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Hospital Administrator',
        action: 'Added Media Asset',
        module: 'Media Library',
        recordId: newItem.id,
        details: `Uploaded/registered new image: ${title}`,
      },
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create media item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete media asset' }, { status: 500 });
  }
}
