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
      shortDesc,
      price,
      comparePrice,
      cost,
      stock,
      sku,
      images,
      thumbnail,
      categoryId,
      isNew,
      isFeatured,
      isOnSale,
      isPack,
      metaTitle,
      metaDescription,
      publishedAt,
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

    // Vérification d’unicité du slug supprimée

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
        shortDesc: shortDesc !== undefined ? shortDesc : existingProduct.shortDesc,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        comparePrice:
          comparePrice !== undefined
            ? comparePrice
              ? parseFloat(comparePrice)
              : null
            : existingProduct.comparePrice,
        cost:
          cost !== undefined
            ? cost
              ? parseFloat(cost)
              : null
            : existingProduct.cost,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        sku: sku !== undefined ? sku : existingProduct.sku,
        images: images !== undefined ? images : existingProduct.images,
        thumbnail: thumbnail !== undefined ? thumbnail : existingProduct.thumbnail,
        categoryId: categoryId || existingProduct.categoryId,
        isNew: isNew !== undefined ? !!isNew : existingProduct.isNew,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existingProduct.isFeatured,
        isOnSale: isOnSale !== undefined ? !!isOnSale : existingProduct.isOnSale,
        isPack: isPack !== undefined ? !!isPack : existingProduct.isPack,
        metaTitle: metaTitle !== undefined ? metaTitle : existingProduct.metaTitle,
        metaDescription:
          metaDescription !== undefined ? metaDescription : existingProduct.metaDescription,
        publishedAt:
          publishedAt !== undefined
            ? publishedAt
              ? new Date(publishedAt)
              : null
            : existingProduct.publishedAt,
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
