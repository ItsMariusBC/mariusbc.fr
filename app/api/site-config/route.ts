import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const config = await prisma.siteConfig.findFirst();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contactButtonUrl } = body;

    if (!contactButtonUrl || typeof contactButtonUrl !== 'string' || contactButtonUrl.length > 2000) {
      return NextResponse.json({ error: 'Invalid contact URL' }, { status: 400 });
    }

    const SAFE_URL_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];
    try {
      const parsed = new URL(contactButtonUrl);
      if (!SAFE_URL_SCHEMES.includes(parsed.protocol)) {
        return NextResponse.json({ error: 'Invalid URL scheme' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

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
