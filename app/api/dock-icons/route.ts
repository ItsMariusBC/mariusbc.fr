import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    
    const icons = await prisma.dockIcon.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(icons);
  } catch (error) {
    console.error('Error fetching dock icons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, iconName, url, tooltip, order } = body;
    
    let finalOrder = order;
    if (!finalOrder) {
      const maxOrderIcon = await prisma.dockIcon.findFirst({
        orderBy: { order: 'desc' }
      });
      finalOrder = (maxOrderIcon?.order || 0) + 1;
    }
    
    const icon = await prisma.dockIcon.create({
      data: {
        name,
        iconName,
        url,
        tooltip,
        order: finalOrder
      }
    });
    
    return NextResponse.json(icon);
  } catch (error) {
    console.error('Error creating dock icon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}