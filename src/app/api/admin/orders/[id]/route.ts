import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest, context: any) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = context.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        wilaya: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: any) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = context.params;

  try {
    const body = await request.json();
    const { status, adminNotes, viberSent, viberNumber } = body;

    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;

      if (status === 'SHIPPED' && !currentOrder.shippedAt) {
        updateData.shippedAt = new Date();
      }
      if (status === 'DELIVERED' && !currentOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
      if (status === 'CANCELED' && !currentOrder.canceledAt) {
        updateData.canceledAt = new Date();
      }
    }

    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (viberSent !== undefined) updateData.viberSent = viberSent;
    if (viberNumber !== undefined) updateData.viberNumber = viberNumber;

    if (status === 'CANCELED' && currentOrder.status !== 'CANCELED') {
      const order = await prisma.$transaction(async (tx: any) => {
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        return await tx.order.update({
          where: { id },
          data: updateData,
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            items: { include: { product: true } },
            wilaya: true,
          },
        });
      });

      return NextResponse.json({ message: 'Order updated and stock restored', order });
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { product: true } },
        wilaya: true,
      },
    });

    return NextResponse.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}