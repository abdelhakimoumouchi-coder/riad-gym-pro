import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      image,
      link,
      buttonText,
      isActive,
      order,
      startDate,
      endDate,
    } = body;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Update banner
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: title || existingBanner.title,
        subtitle: subtitle !== undefined ? subtitle : existingBanner.subtitle,
        image: image || existingBanner.image,
        link: link !== undefined ? link : existingBanner.link,
        buttonText: buttonText !== undefined ? buttonText : existingBanner.buttonText,
        isActive: isActive !== undefined ? !!isActive : existingBanner.isActive,
        order: order !== undefined ? parseInt(order) : existingBanner.order,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingBanner.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingBanner.endDate,
      },
    });

    return NextResponse.json(
      { message: 'Banner updated successfully', banner }
    );
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Delete banner
    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Banner deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
