'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice, WILAYAS, isValidPhone, isValidEmail } from '@/lib/utils';
import { Loader2, MapPin } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    wilaya: '',
    commune: '',
    address: '',
    postalCode: '',
  });

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartData.length === 0) {
      router.push('/panier');
    }
    setCart(cartData);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Le prénom est requis';
    if (!formData.lastName.trim()) return 'Le nom est requis';
    if (!formData.phone.trim()) return 'Le téléphone est requis';
    if (!isValidPhone(formData.phone)) return 'Numéro de téléphone invalide';
    if (formData.email && !isValidEmail(formData.email)) return 'Email invalide';
    if (!formData.wilaya) return 'Veuillez sélectionner une wilaya';
    if (!formData.commune.trim()) return 'La commune est requise';
    if (!formData.address.trim()) return 'L\'adresse est requise';
    return null;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 500;
  const total = subtotal + shippingCost;

  const selectedWilaya = WILAYAS.find(w => w.code === formData.wilaya);
  const isAlger = formData.wilaya === '16';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isAlger) {
      // Normal order for Alger
      setLoading(true);
      setError('');

      try {
        const orderData = {
          guestFirstName: formData.firstName,
          guestLastName: formData.lastName,
          guestPhone: formData.phone,
          guestEmail: formData.email || null,
          wilayaId: formData.wilaya,
          commune: formData.commune,
          deliveryAddress: formData.address,
          postalCode: formData.postalCode || null,
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          shippingCost,
          total,
          paymentMethod: 'CASH_ON_DELIVERY',
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erreur lors de la création de la commande');
        }

        const data = await res.json();
        
        // Clear cart
        localStorage.setItem('cart', '[]');
        window.dispatchEvent(new Event('cartUpdated'));
        
        setSuccess(true);
        setTimeout(() => {
          router.push(`/compte/commandes`);
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    } else {
      // Viber order for other wilayas
      const itemsList = cart.map(item => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`).join('\n');
      
      const message = encodeURIComponent(
        `🛒 Nouvelle commande Riad Gym Pro\n\n` +
        `👤 Client:\n${formData.firstName} ${formData.lastName}\n${formData.phone}\n${formData.email ? formData.email + '\n' : ''}\n` +
        `📍 Adresse:\n${formData.address}\n${formData.commune}, ${selectedWilaya?.name}\n${formData.postalCode ? 'Code postal: ' + formData.postalCode + '\n' : ''}\n` +
        `📦 Produits:\n${cart.map(item => `${item.name} x${item.quantity}`).join(', ')}\n\n` +
        `💰 Total: ${formatPrice(total)}\n\n` +
        `⚠️ Paiement: Veuillez effectuer un dépôt de 1000 DA via CCP ou BaridiMob pour confirmer votre commande. Les détails vous seront envoyés après confirmation.`
      );

      const viberUrl = `viber://chat?number=%2B213XXXXXXXXX&text=${message}`;
      window.location.href = viberUrl;
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark mb-8 font-display">Finaliser la commande</h1>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg mb-6">
              ✓ Commande créée avec succès! Redirection...
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-4">Informations de livraison</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Prénom <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Nom <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Téléphone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="05XX XX XX XX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Email (optionnel)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Wilaya <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionner une wilaya</option>
                        {WILAYAS.map((wilaya) => (
                          <option key={wilaya.code} value={wilaya.code}>
                            {wilaya.code} - {wilaya.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Commune <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="commune"
                        value={formData.commune}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Adresse complète <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Code postal (optionnel)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {!isAlger && formData.wilaya && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Commande via Viber</p>
                        <p>
                          Pour les livraisons hors Alger, veuillez passer votre commande via Viber.
                          Un dépôt de 1000 DA (CCP ou BaridiMob) sera requis pour confirmer la commande.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isAlger ? 'Passer commande' : 'Commander sur Viber'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-dark mb-6">Récapitulatif</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Livraison</span>
                    <span className="font-semibold">{formatPrice(shippingCost)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-dark mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Livraison rapide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Garantie qualité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
