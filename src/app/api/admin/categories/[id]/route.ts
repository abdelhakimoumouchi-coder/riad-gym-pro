import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { generateSlug } from '@/lib/utils';

export async function GET(request: NextRequest, context: any) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = context.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = context.params;

  try {
    const body = await request.json();
    const { name, slug: providedSlug, description, image, order } = body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const slug =
      providedSlug ||
      (name && name !== existingCategory.name
        ? generateSlug(name)
        : existingCategory.slug);

    if (slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({ where: { slug } });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug,
        description:
          description !== undefined ? description : existingCategory.description,
        image: image !== undefined ? image : existingCategory.image,
        order: order !== undefined ? parseInt(order) : existingCategory.order,
      },
    });

    return NextResponse.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  const { id } = context.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}