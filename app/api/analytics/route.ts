import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, targetId, targetName } = body;

    if (!type || (type !== 'contact' && type !== 'dock_icon')) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (type === 'dock_icon' && !targetId) {
      return NextResponse.json({ error: 'Target ID required for dock_icon type' }, { status: 400 });
    }

    // Get client info
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || '';

    // Create analytics record
    await prisma.clickAnalytics.create({
      data: {
        type,
        targetId: targetId || null,
        targetName: targetName || (type === 'contact' ? 'contact' : null),
        ipAddress,
        userAgent,
        referer
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (!type) {
      // Get all analytics grouped by type and target
      const [contactClicks, dockClicks] = await Promise.all([
        // Contact button clicks
        prisma.clickAnalytics.count({
          where: { type: 'contact' }
        }),

        // Dock icon clicks grouped by target name
        prisma.clickAnalytics.groupBy({
          by: ['targetName'],
          where: { 
            type: 'dock_icon',
            targetName: { not: null }
          },
          _count: {
            id: true
          },
          orderBy: {
            _count: {
              id: 'desc'
            }
          }
        })
      ]);

      return NextResponse.json({
        contactClicks,
        dockClicks: dockClicks.map(item => ({
          name: item.targetName,
          clicks: item._count.id
        }))
      });
    }

    if (type === 'contact') {
      const clicks = await prisma.clickAnalytics.count({
        where: { type: 'contact' }
      });
      return NextResponse.json({ clicks });
    }

    if (type === 'dock_icon') {
      const clicks = await prisma.clickAnalytics.groupBy({
        by: ['targetName'],
        where: { 
          type: 'dock_icon',
          targetName: { not: null }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      });

      return NextResponse.json({
        clicks: clicks.map(item => ({
          name: item.targetName,
          count: item._count.id
        }))
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
