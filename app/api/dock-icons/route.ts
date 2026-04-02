import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const SAFE_URL_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return SAFE_URL_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';

    // Only authenticated users can see inactive icons
    if (includeInactive) {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

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
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, iconName, url, tooltip, order } = body;

    if (!name || !iconName || !url || !tooltip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL scheme. Use https, http, mailto, or tel.' }, { status: 400 });
    }

    if (name.length > 100 || iconName.length > 50 || url.length > 2000 || tooltip.length > 200) {
      return NextResponse.json({ error: 'Field length exceeded' }, { status: 400 });
    }

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
