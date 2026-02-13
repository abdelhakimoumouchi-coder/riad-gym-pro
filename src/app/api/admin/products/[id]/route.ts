import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { generateSlug } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { orderItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug: providedSlug,
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const slug =
      providedSlug ||
      (name !== existingProduct.name ? generateSlug(name) : existingProduct.slug);

    if (categoryId && categoryId !== existingProduct.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existingProduct.name,
        slug,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        comparePrice:
          comparePrice !== undefined
            ? comparePrice
              ? parseFloat(comparePrice)
              : null
            : existingProduct.comparePrice,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        images: images !== undefined ? images : existingProduct.images,
        categoryId: categoryId || existingProduct.categoryId,
        isNew: isNew !== undefined ? !!isNew : existingProduct.isNew,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existingProduct.isFeatured,
        isOnSale: isOnSale !== undefined ? !!isOnSale : existingProduct.isOnSale,
        isPack: isPack !== undefined ? !!isPack : existingProduct.isPack,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders' },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
