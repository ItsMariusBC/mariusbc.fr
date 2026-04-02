import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { requireAdmin } from '@/lib/admin-auth';
import { validateDockIconInput } from '@/lib/dock-icons';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';

    // Only admins can access inactive icons from the management UI.
    if (includeInactive) {
      const adminCheck = await requireAdmin();
      if (adminCheck.response) {
        return adminCheck.response;
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
    const adminCheck = await requireAdmin();
    if (adminCheck.response) {
      return adminCheck.response;
    }

    const validation = validateDockIconInput(await request.json());
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!validation.data) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const createData = validation.data;
    let finalOrder = createData.order;
    if (finalOrder === undefined) {
      const maxOrderIcon = await prisma.dockIcon.findFirst({
        orderBy: { order: 'desc' }
      });
      finalOrder = (maxOrderIcon?.order || 0) + 1;
    }

    const icon = await prisma.dockIcon.create({
      data: {
        name: createData.name!,
        iconName: createData.iconName!,
        url: createData.url!,
        tooltip: createData.tooltip!,
        order: finalOrder
      }
    });

    return NextResponse.json(icon);
  } catch (error) {
    console.error('Error creating dock icon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
