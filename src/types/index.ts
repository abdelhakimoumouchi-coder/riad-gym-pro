// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  cost?: number | null;
  stock: number;
  sku?: string | null;
  images: string[];
  thumbnail?: string | null;
  categoryId: string;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isPack: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
  wilayaId: string;
  commune: string;
  deliveryAddress: string;
  postalCode?: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  adminNotes?: string | null;
  viberSent: boolean;
  viberNumber?: string | null;
  createdAt: Date;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  canceledAt?: Date | null;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURNED = 'RETURNED',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CCP = 'CCP',
  BARIDIMOB = 'BARIDIMOB',
  VIBER = 'VIBER',
}

// Banner types
export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  buttonText?: string | null;
  isActive: boolean;
  order: number;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Wilaya types
export interface Wilaya {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  shippingCost: number;
  isAlger: boolean;
}
