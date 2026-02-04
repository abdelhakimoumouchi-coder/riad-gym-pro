# Riad Gym Pro - E-Commerce Platform

A complete e-commerce application for selling sports supplements in Algeria, built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Client Features
- 🛍️ Product catalog with advanced filtering (categories, new, sale, packs)
- 🔍 Product search functionality
- 🛒 Shopping cart with localStorage persistence
- 💳 Smart checkout with Viber integration for non-Algiers orders
- 👤 User authentication and account management
- 📦 Order tracking and history
- 📍 Multiple delivery addresses management
- 🏷️ Product badges (New, Sale with % discount)
- 💰 Automatic shipping cost calculation (500 DA for all wilayas)

### Admin Features
- 📊 Dashboard with real-time statistics
- 📦 Complete product management (CRUD)
- 🖼️ Multi-image upload with Sharp optimization (WebP, 1200x1200, 85% quality)
- 📋 Order management with status tracking
- 🔔 Viber integration for out-of-Algiers orders
- 📂 Categories and banners management
- 📈 Stock management with automatic decrement/increment
- 🎨 Visual product badges (New, Featured, Sale, Pack)

### Technical Features
- ⚡ Next.js 14 App Router with Server Components
- 🎨 Tailwind CSS with custom color palette (Black/White/Gold)
- 🔐 NextAuth.js authentication with credentials
- 🗄️ PostgreSQL with Prisma ORM
- 🖼️ Sharp image optimization
- 📱 Fully responsive design
- 🌐 Support for 58 Algerian wilayas
- 🔒 Role-based access control (Client/Admin)

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#D4AF37` (CTAs, accents)
- **Light Gold**: `#F4E5B8` (hover states)
- **Dark**: `#0A0A0A` (navbar, footer, admin sidebar)
- **Dark Light**: `#1A1A1A` (gradients)
- **White**: `#FFFFFF` (main background)
- **Light Gray**: `#F8F9FA` (alternate sections)

### Typography
- **Headings**: Poppins (font-display)
- **Body**: Inter (font-sans)

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Viber account for order notifications

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/abdelhakimoumouchi-coder/riad-gym-pro.git
cd riad-gym-pro
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/riadgympro?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_VIBER_NUMBER="+213XXXXXXXXX"
```

### 4. Setup database

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database (58 wilayas + 5 categories)
pnpm seed

# Create admin user (email: admin@riadgympro.dz, password: admin123)
pnpm create-admin
```

### 5. Start development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
riad-gym-pro/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── public/
│   └── uploads/               # Uploaded images
│       ├── products/
│       ├── banners/
│       └── categories/
├── scripts/
│   └── create-admin.ts        # Admin creation script
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication
│   │   │   ├── products/     # Products API
│   │   │   ├── categories/   # Categories API
│   │   │   ├── orders/       # Orders API
│   │   │   └── admin/        # Admin API
│   │   ├── admin/            # Admin pages
│   │   ├── auth/             # Auth pages
│   │   ├── compte/           # Account pages
│   │   ├── produits/         # Product pages
│   │   ├── panier/           # Cart page
│   │   ├── checkout/         # Checkout page
│   │   └── page.tsx          # Homepage
│   ├── components/           # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Cart.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── Loading.tsx
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # NextAuth config
│   │   ├── admin-auth.ts    # Admin middleware
│   │   ├── utils.ts         # Utility functions
│   │   └── upload.ts        # Image upload
│   └── types/               # TypeScript types
└── package.json
```

## 📱 Key Pages

### Public Pages
- `/` - Homepage with hero, features, and product sections
- `/produits` - Product catalog with filters
- `/produits/[slug]` - Product detail page
- `/panier` - Shopping cart
- `/checkout` - Checkout with Viber integration
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/compte` - User account dashboard
- `/compte/commandes` - Order history
- `/compte/adresses` - Saved addresses

### Admin Pages
- `/admin` - Admin dashboard with statistics
- `/admin/produits` - Products list
- `/admin/produits/nouveau` - Create product
- `/admin/produits/[id]` - Edit product
- `/admin/commandes` - Orders list
- `/admin/commandes/[id]` - Order detail
- `/admin/categories` - Categories management
- `/admin/bannieres` - Banners management

## 🔑 Default Admin Credentials

After running `pnpm create-admin`:

- **Email**: admin@riadgympro.dz
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## 🚚 Order Flow

### For Algiers (Wilaya 16)
1. Customer fills checkout form
2. Clicks "Passer commande"
3. Order is created in the system
4. Stock is automatically decremented
5. Admin can manage order through admin panel

### For Other Wilayas
1. Customer fills checkout form
2. Sees message about 1000 DA deposit requirement (CCP/BaridiMob)
3. Clicks "Commander sur Viber"
4. Opens Viber with pre-filled message containing:
   - Customer name and contact
   - Product list with quantities
   - Total amount + shipping
   - Delivery address and wilaya
   - Deposit payment instructions

## 📦 Shipping

- **All wilayas**: 500 DA flat rate
- **Algiers**: Direct order processing
- **Outside Algiers**: Viber confirmation + 1000 DA deposit

## 🛠️ Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio
pnpm seed             # Seed database
pnpm create-admin     # Create admin user
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection

## 🖼️ Image Optimization

All uploaded images are automatically:
- Resized to 1200x1200px (maintaining aspect ratio)
- Converted to WebP format
- Compressed to 85% quality
- Stored in `public/uploads/`

## 📊 Database Schema

### Models
1. **User** - Client and admin accounts
2. **Category** - Product categories
3. **Product** - Products with full details
4. **Order** - Customer orders
5. **OrderItem** - Order line items
6. **Wilaya** - 58 Algerian wilayas
7. **Address** - Saved delivery addresses
8. **Banner** - Homepage promotional banners
9. **Setting** - Application settings

## 🌐 API Routes

### Public APIs
- `POST /api/auth/register` - User registration
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Product details
- `GET /api/categories` - List categories
- `POST /api/orders` - Create order
- `GET /api/orders` - User's orders

### Admin APIs (Protected)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET|POST /api/admin/products` - Products CRUD
- `GET|PUT|DELETE /api/admin/products/[id]` - Product operations
- `GET /api/admin/orders` - List all orders
- `GET|PATCH /api/admin/orders/[id]` - Order operations
- `GET|POST|PUT|DELETE /api/admin/categories` - Categories CRUD
- `GET|POST|PUT|DELETE /api/admin/banners` - Banners CRUD

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
pnpm prisma:studio  # Test connection
```

### Image Upload Issues
```bash
# Ensure directories exist
mkdir -p public/uploads/{products,banners,categories}
# Check write permissions
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm build
```

## 📝 Development Notes

### Stock Management
- Stock decrements automatically on order creation
- Stock increments back when order is CANCELED
- Manual adjustment available in admin panel for in-store sales

### Product Badges
- **NOUVEAU**: Displays when `isNew` is true
- **-X%**: Displays when `isOnSale` is true, calculates discount from `price` vs `comparePrice`
- **Badges**: Fully customizable in admin panel

### Viber Integration
- Number configured in `NEXT_PUBLIC_VIBER_NUMBER`
- Message format includes all order details
- Opens native Viber app on mobile, web on desktop

## 🤝 Contributing

This is a private project for Riad Gym Pro. For any issues or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved by Riad Gym Pro

## 📞 Support

For support, email: admin@riadgympro.dz

---

**Built with ❤️ for Riad Gym Pro**