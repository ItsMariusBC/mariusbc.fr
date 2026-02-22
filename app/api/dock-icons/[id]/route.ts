import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    const icon = await prisma.dockIcon.update({
      where: { id },
      data: body
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
