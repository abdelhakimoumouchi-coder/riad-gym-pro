'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/AdminSidebar';
import { Save, Check, X, Truck, Package, RotateCcw } from 'lucide-react';
import Loading from '@/components/Loading';

interface OrderDetail {
  id: string;
  orderNumber: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
  guestEmail: string | null;
  deliveryAddress: string;
  commune: string;
  postalCode: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentMethod: string;
  notes: string | null;
  adminNotes: string | null;
  viberSent: boolean;
  viberNumber: string | null;
  createdAt: string;
  wilaya?: {
    name: string;
    code: string;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      name: string;
      thumbnail: string | null;
      images: string[];
    };
  }>;
}

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viberSent, setViberSent] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchOrder();
    }
  }, [status, session, params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Commande non trouvée');
      }
      
      const { order } = await response.json();
      setOrder(order);
      setAdminNotes(order.adminNotes || '');
      setSelectedStatus(order.status);
      setViberSent(order.viberSent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (updates: Partial<OrderDetail>) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      await fetchOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'CANCELED' && order) {
      const confirmMsg = `Êtes-vous sûr de vouloir annuler cette commande ?\nLe stock sera automatiquement remis à jour.`;
      if (!confirm(confirmMsg)) return;
    }
    await updateOrder({ status: newStatus });
  };

  const handleSaveNotes = async () => {
    await updateOrder({ adminNotes, viberSent });
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error || 'Commande non trouvée'}
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      PROCESSING: 'En traitement',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      CANCELED: 'Annulée',
      RETURNED: 'Retournée',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      CASH_ON_DELIVERY: 'Paiement à la livraison',
      CCP: 'CCP',
      BARIDIMOB: 'BaridiMob',
      VIBER: 'Viber',
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/admin/commandes')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              ← Retour aux commandes
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Commande {order.orderNumber}</h1>
                <p className="text-gray-600 mt-1">
                  Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          {/* Status Change */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Changer le statut</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {order.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusChange('CONFIRMED')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Confirmer
                </button>
              )}
              
              {(order.status === 'CONFIRMED' || order.status === 'PENDING') && (
                <button
                  onClick={() => handleStatusChange('PROCESSING')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Package className="w-5 h-5" />
                  Traiter
                </button>
              )}
              
              {(order.status === 'PROCESSING' || order.status === 'CONFIRMED') && (
                <button
                  onClick={() => handleStatusChange('SHIPPED')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Truck className="w-5 h-5" />
                  Expédier
                </button>
              )}
              
              {order.status === 'SHIPPED' && (
                <button
                  onClick={() => handleStatusChange('DELIVERED')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Livrer
                </button>
              )}
              
              {order.status !== 'CANCELED' && order.status !== 'RETURNED' && (
                <button
                  onClick={() => handleStatusChange('CANCELED')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
              )}
              
              {order.status === 'DELIVERED' && (
                <button
                  onClick={() => handleStatusChange('RETURNED')}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retourner
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Nom complet</label>
                  <p className="font-medium text-gray-900">
                    {order.guestFirstName} {order.guestLastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Téléphone</label>
                  <p className="font-medium text-gray-900">{order.guestPhone}</p>
                </div>
                {order.guestEmail && (
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-gray-900">{order.guestEmail}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600">Wilaya</label>
                  <p className="font-medium text-gray-900">
                    {order.wilaya ? `${order.wilaya.code} - ${order.wilaya.name}` : 'Wilaya inconnue'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Commune</label>
                  <p className="font-medium text-gray-900">{order.commune}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Adresse</label>
                  <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                </div>
                {order.postalCode && (
                  <div>
                    <label className="text-sm text-gray-600">Code postal</label>
                    <p className="font-medium text-gray-900">{order.postalCode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Méthode de paiement</label>
                  <p className="font-medium text-gray-900">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium text-gray-900">{order.subtotal.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="font-medium text-gray-900">{order.shippingCost.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-[#D4AF37]">{order.total.toFixed(2)} DA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Articles commandés</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix unitaire
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {item.product.thumbnail || item.product.images[0] ? (
                            <img
                              src={item.product.thumbnail || item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                          )}
                          <span className="font-medium text-gray-900">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {item.price.toFixed(2)} DA
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {item.total.toFixed(2)} DA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            
            {order.notes && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Notes du client</label>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                  {order.notes}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Notes admin</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Ajouter des notes privées..."
              />
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={viberSent}
                  onChange={(e) => setViberSent(e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Message Viber envoyé</span>
              </label>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}