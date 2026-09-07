import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get('module');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (moduleFilter && moduleFilter !== 'All') {
      where.module = moduleFilter;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { name: true, role: true, email: true },
        },
      },
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userName, action, module, recordId, details } = data;

    const log = await prisma.auditLog.create({
      data: {
        userName: userName || 'Hospital Staff',
        action: action || 'Action performed',
        module: module || 'System',
        recordId: recordId || null,
        details: details || null,
      },
    });

    return NextResponse.json(log);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create audit log' }, { status: 500 });
  }
}
