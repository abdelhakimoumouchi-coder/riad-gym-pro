'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ChevronLeft, Eye } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  PROCESSING: 'En préparation',
  SHIPPED: 'Expédié',
  DELIVERED: 'Livré',
  CANCELED: 'Annulé',
  RETURNED: 'Retourné',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light-gray flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/compte"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour au compte
            </Link>
            <h1 className="text-4xl font-bold text-dark mb-2 font-display">Mes Commandes</h1>
            <p className="text-gray-600">Historique de toutes vos commandes</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-dark mb-4">Aucune commande</h2>
              <p className="text-gray-600 mb-8">
                Vous n'avez pas encore passé de commande
              </p>
              <Link
                href="/produits"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Commandé le {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} article(s)
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4 mb-4">
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {item.product?.name || 'Produit'} × {item.quantity}
                            </span>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm text-gray-500">
                            ... et {order.items.length - 3} autre(s) produit(s)
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button className="w-full md:w-auto bg-light-gray hover:bg-gray-300 text-dark px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Voir les détails
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
