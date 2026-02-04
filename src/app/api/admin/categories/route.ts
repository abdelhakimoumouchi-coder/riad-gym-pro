import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { generateSlug } from '@/lib/utils';

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    const { name, slug: providedSlug, description, image, order } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate or validate slug
    const slug = providedSlug || generateSlug(name);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(
      { message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
