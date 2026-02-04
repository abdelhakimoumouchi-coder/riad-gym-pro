import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const paymentMethod = searchParams.get('paymentMethod');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

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
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                thumbnail: true,
                price: true,
              },
            },
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
