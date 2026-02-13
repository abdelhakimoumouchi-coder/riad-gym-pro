import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { generateSlug } from '@/lib/utils';

export async function GET(request: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    const total = await prisma.product.count({ where });
    const skip = (parseInt(page) - 1) * perPage;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    });

    return NextResponse.json({
      products,
      pagination: {
        page: parseInt(page),
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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
      name,
      description,
      price,
      comparePrice,
      stock,
      images,
      categoryId,
      isNew,
      isFeatured,
      isOnSale,
      isPack,
    } = body;

    // Validation
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Always generate slug from name on the backend
    const slug = generateSlug(name);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        images: images || [],
        categoryId,
        isNew: !!isNew,
        isFeatured: !!isFeatured,
        isOnSale: !!isOnSale,
        isPack: !!isPack,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}