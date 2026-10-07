export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  customerCode: string;
  phone?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  category: 'Women' | 'Boys/Men';
  description: string;
  stock: number;
  sizes: string[];
  colors: string[];
  status: 'in_stock' | 'out_of_stock';
  visibility: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item cart key (productId-size-color)
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad';
export type DeliveryArea = 'Moulvibazar' | 'Outside Moulvibazar';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  phone: string;
  address: string;
  area: DeliveryArea;
  items: OrderItem[];
  quantity: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  appliedVoucherIds?: string[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation?: string;
  active: boolean;
  createdAt?: string;
}

export interface QuizAttempt {
  id: string;
  customerId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  rewardAmount: number;
  createdAt: string;
  dateStr: string; // YYYY-MM-DD
}

export type VoucherSource = 'quiz' | 'mystery_box' | 'admin' | 'welcome';
export type VoucherStatus = 'active' | 'used' | 'expired';

export interface Voucher {
  id: string;
  customerId: string;
  amount: number;
  source: VoucherSource;
  createdAt: string;
  expiresAt: string;
  usageCount: number;
  maxUsage: number; // 1 for ৳20-80, up to 3 for ৳1-19
  status: VoucherStatus;
}

export interface RewardProfile {
  customerId: string;
  streak: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
  lastMysteryBoxDate?: string;
  isGiftEligible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MysteryBoxClaim {
  id: string;
  customerId: string;
  wonAmount: number;
  weekIdentifier: string; // e.g. 2026-W41
  createdAt: string;
}

export interface StoreSettings {
  heroTagline: string;
  heroHeading: string;
  heroDescription: string;
  announcementText: string;
  ownerName: string;
  whatsappNumber: string;
  paymentNumber: string;
}
