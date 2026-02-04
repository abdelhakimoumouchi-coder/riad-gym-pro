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
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const { status, adminNotes, viberSent, viberNumber } = body;

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;

      // Set timestamps based on status
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

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    if (viberSent !== undefined) {
      updateData.viberSent = viberSent;
    }

    if (viberNumber !== undefined) {
      updateData.viberNumber = viberNumber;
    }

    // Handle stock restoration if order is being canceled
    if (status === 'CANCELED' && currentOrder.status !== 'CANCELED') {
      // Use transaction to update order and restore stock
      const order = await prisma.$transaction(async (tx: any) => {
        // Restore stock for each item
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        // Update order
        return await tx.order.update({
          where: { id: params.id },
          data: updateData,
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
                product: true,
              },
            },
            wilaya: true,
          },
        });
      });

      return NextResponse.json(
        { message: 'Order updated and stock restored', order }
      );
    }

    // Regular update without stock changes
    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
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
            product: true,
          },
        },
        wilaya: true,
      },
    });

    return NextResponse.json(
      { message: 'Order updated successfully', order }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
