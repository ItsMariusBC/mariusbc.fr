import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const adminCount = await prisma.user.count();
    
    return NextResponse.json({
      adminExists: adminCount > 0
    });
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}