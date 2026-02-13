import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isNew = searchParams.get('isNew');
    const isOnSale = searchParams.get('isOnSale');
    const isPack = searchParams.get('isPack');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';
    const perPage = parseInt(searchParams.get('perPage') || '12');

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }
    if (isNew === 'true') where.isNew = true;
    if (isOnSale === 'true') where.isOnSale = true;
    if (isPack === 'true') where.isPack = true;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.product.count({ where });
    const skip = (parseInt(page) - 1) * perPage;
    const take = limit ? parseInt(limit) : perPage;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
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
