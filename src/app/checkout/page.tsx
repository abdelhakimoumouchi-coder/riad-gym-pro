'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice, WILAYAS, isValidPhone } from '@/lib/utils';
import { VIBER_NUMBER, INPUT_CLASS } from '@/lib/constants';
import { Loader2, MapPin } from 'lucide-react';

const ALGER_COMMUNES = [
  'Alger-Centre','Bab El Oued','El Madania','El Mouradia','Hydra','Kouba','Bachdjerrah','Bir Mourad Rais',
  'Birmandreis','El Biar','Ben Aknoun','Dely Brahim','Cheraga','Draria','El Harrach','Baraki','Bordj El Kiffan',
  'Dar El Beida','Bab Ezzouar','Baba Hassen','Douera','Khracia','Ouled Chebel','Rahmania','Sidi Moussa',
  'Tessala El Merdja'
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
  });

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartData.length === 0) {
      router.push('/panier');
    }
    setCart(cartData);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Le nom complet est requis';
    if (!formData.phone.trim()) return 'Le téléphone est requis';
    if (!isValidPhone(formData.phone)) return 'Numéro de téléphone invalide';
    if (!formData.wilaya) return 'Veuillez sélectionner une wilaya';
    if (!formData.commune.trim()) return 'La commune est requise';
    return null;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 500; // Alger uniquement
  const totalAlger = subtotal + shippingCost;
  const totalNonAlger = subtotal; // hors Alger, pas de livraison affichée

  const selectedWilaya = WILAYAS.find((w) => w.code === formData.wilaya);
  const isAlger = formData.wilaya === '16';

  const splitName = () => {
    const parts = formData.fullName.trim().split(/\s+/);
    const first = parts[0] || 'Client';
    const last = parts.slice(1).join(' ') || 'Client';
    return { first, last };
  };

  const buildMessageBodyNonAlger = () => {
    const itemsList = cart
      .map((item) => `${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`)
      .join('\n');

    return (
      `👤 Nom: ${formData.fullName}\n` +
      `📞 Tel: ${formData.phone}\n` +
      `📍 Wilaya: ${selectedWilaya?.name || ''}\n` +
      `🏙️ Commune: ${formData.commune}\n\n` +
      `📦 Produits:\n${itemsList}\n\n`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const { first, last } = splitName();

    if (isAlger) {
      // Alger : enregistrement en base (+500 DA)
      setLoading(true);
      setError('');
      try {
        const orderData = {
          guestFirstName: first,
          guestLastName: last,
          guestPhone: formData.phone,
          guestEmail: null,
          wilayaId: formData.wilaya,
          commune: formData.commune,
          deliveryAddress: formData.commune,
          postalCode: null,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          shippingCost,
          total: totalAlger,
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

        localStorage.setItem('cart', '[]');
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    } else {
      // Hors Alger : Viber avec texte prérempli
      const messageBody = buildMessageBodyNonAlger();
      const encoded = encodeURIComponent(messageBody);

      // Copie pour pouvoir coller si le texte est ignoré
      try { await navigator.clipboard.writeText(messageBody); } catch {}

      // 1) Chat direct vers ton numéro (peut ignorer le texte sur iOS)
      const chatUrl = `viber://chat?number=${encodeURIComponent(VIBER_NUMBER)}&text=${encoded}`;
      // 2) Fallback forward (prérempli mais il faudra sélectionner le contact)
      const forwardUrl = `viber://forward?text=${encoded}`;

      window.location.href = chatUrl;
      setTimeout(() => {
        window.location.href = forwardUrl;
      }, 1200);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  const communesForWilaya = isAlger ? ALGER_COMMUNES : null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark mb-8 font-display">Finaliser la commande</h1>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg mb-6">
              ✓ Commande créée avec succès!
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-4">Informations de livraison</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Nom et prénom <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                        required
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Téléphone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="05XX XX XX XX"
                        className={INPUT_CLASS}
                        required
                      />
                    </div>

                    <div className="md:col-span-1">
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

                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Commune <span className="text-red-600">*</span>
                      </label>
                      {communesForWilaya ? (
                        <select
                          name="commune"
                          value={formData.commune}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner une commune</option>
                          {communesForWilaya.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="commune"
                          value={formData.commune}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>

                {!isAlger && formData.wilaya && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Commande via Viber</p>
                        <p dir="rtl">يُرجى دفع عربون 1000 دج عبر ccp ⚠️</p>
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
                  {isAlger ? 'Commander' : 'Commander sur Viber'}
                </button>
              </form>
            </div>

            {/* Récap */}
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
                    <span>Livraison (Alger)</span>
                    <span className="font-semibold">{formatPrice(shippingCost)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-dark mb-6">
                  <span>Total</span>
                  <span className="text-primary">
                    {isAlger ? formatPrice(totalAlger) : formatPrice(totalNonAlger)}
                  </span>
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