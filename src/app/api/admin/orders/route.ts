import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = parseInt(searchParams.get('perPage') || searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    // Uniquement Alger (code 16) via relation
    const where: any = {
      wilaya: { code: '16' },
    };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestFirstName: { contains: search, mode: 'insensitive' } },
        { guestLastName: { contains: search, mode: 'insensitive' } },
        { guestPhone: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.order.count({ where });
    const skip = (parseInt(page) - 1) * perPage;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
        wilaya: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    });

    return NextResponse.json({
      orders,
      pagination: {
        page: parseInt(page),
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}