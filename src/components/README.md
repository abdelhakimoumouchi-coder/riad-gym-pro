# Shared React Components

This directory contains all shared/reusable React components for the Riad Gym Pro e-commerce application.

## Components

### Navbar
**File:** `Navbar.tsx`  
**Type:** Client Component

Transparent navigation bar with glassmorphism effect, featuring:
- Logo and branding
- User account dropdown (login/register or account menu)
- Dynamic categories dropdown (loaded from API)
- Search bar with product search
- Shopping cart icon with badge counter
- Mobile responsive menu

**Usage:**
```tsx
import { Navbar } from '@/components';

<Navbar />
```

### Footer
**File:** `Footer.tsx`  
**Type:** Server Component

Black gradient footer with gold accents, featuring:
- Brand information and social links (Viber, Facebook, Instagram)
- Navigation links
- Information links (delivery, payment, returns)
- Contact information
- Copyright and trust badges

**Usage:**
```tsx
import { Footer } from '@/components';

<Footer />
```

### ProductCard
**File:** `ProductCard.tsx`  
**Type:** Client Component

Product display card with:
- Optimized product image (Next.js Image)
- Category badge
- "NOUVEAU" and discount badges
- Product name and description
- Price display with compare price
- "Ajouter au panier" and "Acheter maintenant" buttons
- Hover effects

**Usage:**
```tsx
import { ProductCard } from '@/components';

<ProductCard product={productData} />
```

### Cart
**File:** `Cart.tsx`  
**Type:** Client Component

Slide-out cart sidebar featuring:
- Cart items list with images
- Quantity controls (+/-)
- Remove item functionality
- Subtotal calculation
- "Voir le panier" and "Commander" buttons
- Empty cart state
- Uses localStorage for cart persistence

**Usage:**
```tsx
import { Cart } from '@/components';

const [isCartOpen, setIsCartOpen] = useState(false);

<Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
```

### Loading
**File:** `Loading.tsx`  
**Type:** Server/Client Component

Loading spinner with multiple variants:
- `Loading` - Main component with size options
- `LoadingSpinner` - Simple inline spinner
- `LoadingPage` - Full page loading state
- `LoadingButton` - Button loading state

**Usage:**
```tsx
import { Loading, LoadingPage, LoadingButton } from '@/components';

<Loading size="lg" text="Chargement..." />
<Loading fullPage />
<LoadingPage />
<LoadingButton />
```

### AdminSidebar
**File:** `AdminSidebar.tsx`  
**Type:** Client Component

Admin dashboard sidebar with:
- Dashboard link
- Products menu with submenu (List, New)
- Orders link
- Categories link
- Banners link
- Logout button
- Active state highlighting with gold accent
- Black background

**Usage:**
```tsx
import { AdminSidebar } from '@/components';

<AdminSidebar />
```

## Design System

### Colors
- **Primary Gold:** `#D4AF37` (primary)
- **Light Gold:** `#F4E5B8` (primary-light)
- **Dark:** `#0A0A0A` (dark)
- **Dark Light:** `#1A1A1A` (dark-light)
- **White:** `#FFFFFF`
- **Light Gray:** `#F8F9FA` (light-gray)

### Cart State Management
The cart uses localStorage for state persistence with custom events:
- Storage key: `cart`
- Update event: `cartUpdated`
- Format: Array of `CartItem` objects

```typescript
interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}
```

### Icons
All icons use `lucide-react` package.

### Navigation
All internal links use Next.js `Link` component.

### Images
All images use Next.js `Image` component with optimization.

## Notes
- Use `'use client'` directive for interactive components
- Components follow responsive design principles
- Tailwind CSS classes are used for styling
- TypeScript types are properly defined
