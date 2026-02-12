import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { VIBER_NUMBER } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-dark to-dark-light text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              RI GYM <span className="text-primary">PRO</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Votre destination pour les équipements de fitness et musculation en Algérie.
            </p>
            <div className="flex space-x-4">
              <a
                href={`viber://chat?number=${encodeURIComponent(VIBER_NUMBER)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Viber"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.617 6.55 20.41h.005l-.004 2.416s-.037.98.589 1.177c.716.232 1.04-.223 3.267-2.883 3.724.323 6.584-.417 6.909-.525.752-.252 5.007-.815 5.695-6.648.713-6.035-.421-9.849-2.595-11.474C18.421.506 14.469.029 11.4 0zm.059 1.617c2.88-.007 6.44.397 8.230 1.826 1.944 1.483 2.888 4.877 2.267 10.157-.605 5.15-4.145 5.449-4.790 5.668-.285.097-2.888.766-6.089.486 0 0-2.426 2.917-3.185 3.678-.121.121-.26.167-.352.145-.13-.03-.166-.188-.165-.414l.02-4.016c-5.397-1.572-5.05-6.573-4.998-9.196.052-2.623.587-4.803 2.015-6.231C6.15 1.982 9.597 1.617 11.459 1.617z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/riadgym"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/riadgym"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Liens rapides</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/produits" className="hover:text-primary transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/panier" className="hover:text-primary transition-colors">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="hover:text-primary transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors text-sm">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <div>+213 674 02 20 54</div>
                  <div>+213 551 77 63 98</div>
                  <div className="text-sm text-gray-500">Dim-Sam 10h-22h</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <a href="https://share.google/H6kq93ACRoT6v4d6I" className="text-gray-400 hover:text-primary transition-colors">
                    Alger, Algérie
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Empty column for layout */}
          <div />
        </div>

        <div className="mt-12 pt-8 border-t border-dark-lighter">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Riad Gym Pro. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Paiement sécurisé
              </span>
              <span className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Livraison 58 wilayas
              </span>
              <span className="flex items-center">
                <span className="text-primary mr-2">✓</span>
                Garantie qualité
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}