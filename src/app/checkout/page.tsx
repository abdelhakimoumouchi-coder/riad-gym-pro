'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice, WILAYAS, isValidPhone } from '@/lib/utils';
import { INPUT_CLASS } from '@/lib/constants';
import { Loader2, MapPin, Upload, Trash2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

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

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceiptImage(null);
    setReceiptPreview(null);
  };

  const isAlger = formData.wilaya === '16';

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Le nom complet est requis';
    if (!formData.phone.trim()) return 'Le téléphone est requis';
    if (!isValidPhone(formData.phone)) return 'Numéro de téléphone invalide';
    if (!formData.wilaya) return 'Veuillez sélectionner une wilaya';
    if (isAlger && !formData.commune.trim()) return 'La commune est requise';
    if (!isAlger && !receiptImage) return 'Veuillez uploader la photo du reçu de versement';
    if (!turnstileToken) return 'Veuillez compléter la vérification de sécurité';
    return null;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const splitName = () => {
    const parts = formData.fullName.trim().split(/\s+/);
    const first = parts[0] || 'Client';
    const last = parts.slice(1).join(' ') || 'Client';
    return { first, last };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const { first, last } = splitName();
    setLoading(true);
    setError('');

    try {
      let receiptBase64: string | null = null;
      if (!isAlger && receiptImage) {
        receiptBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(receiptImage);
        });
      }

      const orderData = {
        guestFirstName: first,
        guestLastName: last,
        guestPhone: formData.phone,
        guestEmail: null,
        wilayaId: formData.wilaya,
        commune: formData.commune || '',
        deliveryAddress: formData.commune || '',
        postalCode: null,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCost: 0,
        total: subtotal,
        paymentMethod: isAlger ? 'CASH_ON_DELIVERY' : 'CCP',
        paymentReceipt: receiptBase64,
        turnstileToken,
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
                        Commune {isAlger && <span className="text-red-600">*</span>}
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
                          placeholder="Optionnel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Section upload reçu pour hors Alger */}
                {!isAlger && formData.wilaya && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-semibold mb-1">Confirmation de commande</p>
                          <p>
                            Pour confirmer votre commande, veuillez envoyer une photo du reçu du
                            versement de <strong>1 000 DA</strong> au CCP ou BaridiMob suivant :
                          </p>
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li><strong>CCP :</strong> 00799999 99 clé 99</li>
                            <li><strong>BaridiMob :</strong> 00799999 0079999999</li>
                          </ul>
                          <p className="mt-2" lang="ar" dir="rtl">
                            ⚠️ يُرجى دفع عربون 1000 دج عبر CCP أو BaridiMob
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Photo du reçu de versement <span className="text-red-600">*</span>
                      </label>

                      {receiptPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={receiptPreview}
                            alt="Reçu de versement"
                            className="w-64 h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeReceipt}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">
                              Cliquez pour uploader la photo du reçu
                            </span>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Cloudflare Turnstile CAPTCHA */}
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                    options={{ theme: 'light' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Commander
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

                <div className="flex justify-between text-xl font-bold text-dark mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
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