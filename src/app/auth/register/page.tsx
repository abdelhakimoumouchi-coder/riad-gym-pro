'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';
import { isValidEmail, isValidPhone } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Le prénom est requis';
    if (!formData.lastName.trim()) return 'Le nom est requis';
    if (!formData.email.trim()) return 'L\'email est requis';
    if (!isValidEmail(formData.email)) return 'Email invalide';
    if (!formData.phone.trim()) return 'Le téléphone est requis';
    if (!isValidPhone(formData.phone)) return 'Numéro de téléphone invalide';
    if (formData.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (formData.password !== formData.confirmPassword) return 'Les mots de passe ne correspondent pas';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark-lighter flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold text-white mb-2">
              RIAD <span className="text-primary">GYM</span>
            </div>
          </Link>
          <p className="text-gray-400">Créez votre compte</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-dark mb-6 text-center font-display">
            Inscription
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
              Inscription réussie ! Redirection vers la connexion...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Mot de passe <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Confirmer le mot de passe <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  S&apos;inscrire
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary-dark font-semibold">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/" className="text-gray-600 hover:text-primary text-sm">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
