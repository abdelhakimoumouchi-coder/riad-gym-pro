import Link from 'next/link';
import { Instagram, Phone, MapPin } from 'lucide-react';
import { VIBER_NUMBER } from '@/lib/constants';

const TikTokIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21 8.13a5.83 5.83 0 0 1-3.33-1.06 6.36 6.36 0 0 1-1.32-1.32A5.86 5.86 0 0 1 15.3 3h-2.73v12.37a2.07 2.07 0 0 1-2.08 2.07A2.07 2.07 0 0 1 8.42 15a2.07 2.07 0 0 1 2.07-2.07 2 2 0 0 1 .47.06V9.8A5.44 5.44 0 0 0 10.49 9 5.74 5.74 0 0 0 4.7 14.7 5.74 5.74 0 0 0 10.49 20a5.74 5.74 0 0 0 5.79-5.79V9.83a8.35 8.35 0 0 0 4.72 1.52Z" />
  </svg>
);

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
                href="https://www.instagram.com/ri.gym.pro?igsh=MXYzczhnbjk1bHpsdw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@ri.gym.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-dark-lighter hover:bg-primary transition-colors flex items-center justify-center"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
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
