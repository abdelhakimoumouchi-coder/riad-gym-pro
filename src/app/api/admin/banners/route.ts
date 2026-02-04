import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Validation
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    // Create banner
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        link,
        buttonText,
        isActive: isActive !== undefined ? !!isActive : true,
        order: order !== undefined ? parseInt(order) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(
      { message: 'Banner created successfully', banner },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
