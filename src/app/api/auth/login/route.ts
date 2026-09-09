import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputId = (body.email || body.userId || '').trim();
    const inputPass = (body.password || '').trim();

    if (!inputId || !inputPass) {
      return NextResponse.json({ error: 'Please enter User ID and Password' }, { status: 400 });
    }

    // Try finding by exact match or lowercase match
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: inputId },
          { email: inputId.toLowerCase() },
        ],
      },
    });

    // If not found in DB but matches requested admin credentials, ensure it exists
    if (!user && (inputId.toLowerCase() === 'admin@776753' || inputId === 'Admin@776753')) {
      user = await prisma.user.upsert({
        where: { email: 'Admin@776753' },
        update: { password: 'karimsakib', role: 'Super Admin', name: 'Hospital Administrator' },
        create: { email: 'Admin@776753', password: 'karimsakib', role: 'Super Admin', name: 'Hospital Administrator' },
      });
    }

    if (!user || user.password !== inputPass) {
      return NextResponse.json({ error: 'Invalid User ID or Password' }, { status: 401 });
    }

    // Record login audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'Logged In',
        module: 'Authentication',
        details: `${user.role} (${user.email}) successfully logged into admin panel.`,
      },
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set session cookie
    response.cookies.set('medicalpress_session', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('medicalpress_session', '', {
    maxAge: 0,
    path: '/',
  });
  return response;
}
