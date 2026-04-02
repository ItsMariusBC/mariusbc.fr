import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { validateDockIconInput } from '@/lib/dock-icons';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.response) {
      return adminCheck.response;
    }

    const { id } = await params;
    const validation = validateDockIconInput(await request.json(), { partial: true });
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!validation.data || Object.keys(validation.data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updateData = validation.data;

    const icon = await prisma.dockIcon.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(icon);
  } catch (error) {
    console.error('Error updating dock icon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.response) {
      return adminCheck.response;
    }

    const { id } = await params;

    await prisma.dockIcon.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dock icon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
