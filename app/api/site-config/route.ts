import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.siteConfig.findFirst();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactButtonUrl } = body;
    
    const existing = await prisma.siteConfig.findFirst();
    
    let config;
    if (existing) {
      config = await prisma.siteConfig.update({
        where: { id: existing.id },
        data: { contactButtonUrl }
      });
    } else {
      config = await prisma.siteConfig.create({
        data: { contactButtonUrl }
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}