import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    // Get statistics
    const [
      totalOrders,
      totalProducts,
      totalCategories,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total products
      prisma.product.count(),
      
      // Total categories
      prisma.category.count(),
      
      // Total revenue (sum of all completed orders)
      prisma.order.aggregate({
        where: {
          status: { in: ['DELIVERED'] },
        },
        _sum: { total: true },
      }),
      
      // Pending orders
      prisma.order.count({
        where: { status: 'PENDING' },
      }),
      
      // Low stock products (stock < 10)
      prisma.product.count({
        where: { stock: { lt: 10 } },
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
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
                },
              },
            },
          },
          wilaya: true,
        },
      }),
    ]);

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await prisma.$queryRaw<Array<{
      month: string;
      revenue: number;
    }>>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        SUM(total)::float as revenue
      FROM "orders"
      WHERE status = 'DELIVERED'
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    return NextResponse.json({
      stats: {
        totalOrders,
        totalProducts,
        totalCategories,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        lowStockProducts,
      },
      monthlyRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
