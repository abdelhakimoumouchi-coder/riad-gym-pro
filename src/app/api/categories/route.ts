import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const cleanedCategories = categories.map((category) => ({
      ...category,
      image:
        category.image && category.image.length > 1000
          ? null
          : category.image,
    }));

    return NextResponse.json({ categories: cleanedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
