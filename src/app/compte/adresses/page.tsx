'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { MapPin, Plus, Edit, Trash2, ChevronLeft, Star } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  postalCode?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    try {
      // Since we don't have an addresses API endpoint, we'll simulate it with empty data
      // In a real app, you'd fetch from /api/addresses
      setAddresses([]);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd POST/PUT to /api/addresses
    console.log('Saving address:', formData);
    setShowForm(false);
    setEditingId(null);
    setFormData({
      label: '',
      firstName: '',
      lastName: '',
      phone: '',
      wilaya: '',
      commune: '',
      address: '',
      postalCode: '',
      isDefault: false,
    });
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      // In a real app, you'd DELETE to /api/addresses/:id
      console.log('Deleting address:', id);
    }
  };

  const handleSetDefault = async (id: string) => {
    // In a real app, you'd PATCH to /api/addresses/:id
    console.log('Setting default address:', id);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/compte"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour au compte
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-dark mb-2 font-display">Mes Adresses</h1>
                <p className="text-gray-600">Gérer vos adresses de livraison</p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              )}
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">
                {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Libellé (ex: Maison, Bureau)
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Prénom</label>
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
                    <label className="block text-sm font-medium text-dark mb-2">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Wilaya</label>
                    <input
                      type="text"
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Commune</label>
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

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Adresse complète</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Code postal (optionnel)</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="mr-2 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-sm text-gray-700">Définir comme adresse par défaut</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        label: '',
                        firstName: '',
                        lastName: '',
                        phone: '',
                        wilaya: '',
                        commune: '',
                        address: '',
                        postalCode: '',
                        isDefault: false,
                      });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-dark py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 && !showForm ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-dark mb-4">Aucune adresse enregistrée</h2>
              <p className="text-gray-600 mb-8">
                Ajoutez une adresse pour faciliter vos futures commandes
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter une adresse
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-dark">{address.label}</h3>
                          {address.isDefault && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                              <Star className="w-3 h-3 fill-current" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700">
                          <p className="font-medium">{address.firstName} {address.lastName}</p>
                          <p>{address.phone}</p>
                          <p className="mt-2">{address.address}</p>
                          <p>{address.commune}, {address.wilaya}</p>
                          {address.postalCode && <p>Code postal: {address.postalCode}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 hover:bg-light-gray rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 hover:bg-light-gray rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Définir par défaut
                    </button>
                  )}
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
