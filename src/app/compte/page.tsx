'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { formatPrice, formatDate } from '@/lib/utils';
import { User, Package, MapPin, Clock, ShoppingBag } from 'lucide-react';

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

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=5');
      if (res.ok) {
        const data = await res.json();
        const ordersList = data.orders || [];
        setOrders(ordersList);
        
        setStats({
          totalOrders: ordersList.length,
          pendingOrders: ordersList.filter((o: Order) => o.status === 'PENDING').length,
        });
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
            <h1 className="text-4xl font-bold text-dark mb-2 font-display">Mon Compte</h1>
            <p className="text-gray-600">Bienvenue, {session.user?.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-600">Commandes totales</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">{stats.pendingOrders}</div>
                  <div className="text-sm text-gray-600">En attente</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dark">Actif</div>
                  <div className="text-sm text-gray-600">Statut du compte</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/compte/commandes"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-dark group-hover:text-primary transition-colors mb-2">
                    Mes Commandes
                  </h3>
                  <p className="text-gray-600">Consulter l'historique de vos commandes</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
            </Link>

            <Link
              href="/compte/adresses"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-dark group-hover:text-primary transition-colors mb-2">
                    Mes Adresses
                  </h3>
                  <p className="text-gray-600">Gérer vos adresses de livraison</p>
                </div>
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark font-display">Commandes Récentes</h2>
              {orders.length > 0 && (
                <Link href="/compte/commandes" className="text-primary hover:text-primary-dark font-semibold">
                  Voir tout
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                <Link
                  href="/produits"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Commencer mes achats
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-dark">{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} article(s)
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
