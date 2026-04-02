import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Server-side first-user restriction
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Un compte administrateur existe deja' },
        { status: 403 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du compte' },
      { status: 500 }
    );
  }
}
