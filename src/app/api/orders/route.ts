import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { sendTelegramNotification } from '@/lib/telegram';

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      guestFirstName,
      guestLastName,
      guestPhone,
      guestEmail,
      wilayaId,
      commune,
      deliveryAddress,
      postalCode,
      paymentMethod,
      paymentReceipt,
      turnstileToken,
      notes,
    } = body;

    // Vérification CAPTCHA Turnstile
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Vérification de sécurité requise' },
        { status: 400 }
      );
    }

    const isCaptchaValid = await verifyTurnstile(turnstileToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: 'Échec de la vérification de sécurité. Veuillez réessayer.' },
        { status: 403 }
      );
    }

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!guestFirstName || !guestLastName || !guestPhone || !wilayaId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session (may be null for guest orders)
    const session = await getServerSession(authOptions);

    // Verify products exist and have sufficient stock
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 404 }
      );
    }

    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Get wilaya
    const wilaya = await prisma.wilaya.findFirst({
      where: {
        OR: [
          { id: wilayaId },
          { code: wilayaId },
        ],
      },
    });

    if (!wilaya) {
      return NextResponse.json(
        { error: 'Invalid wilaya' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId);
      const price = product!.price;
      const total = price * item.quantity;
      subtotal += total;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        total,
      };
    });

    const shippingCost = 0;
    const total = subtotal;

    // Create order with items and decrement stock
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id || null,
          guestFirstName,
          guestLastName,
          guestPhone,
          guestEmail: guestEmail || null,
          wilayaId: wilaya.id,
          commune: commune || '',
          deliveryAddress: deliveryAddress || commune || '',
          postalCode,
          subtotal,
          shippingCost,
          total,
          paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
          paymentReceipt: paymentReceipt || null,
          notes,
          status: 'PENDING',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          wilaya: true,
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Envoyer notification Telegram (sans bloquer la réponse)
    sendTelegramNotification(order).catch(console.error);

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        wilaya: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}