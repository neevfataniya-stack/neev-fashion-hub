export type CategoryType = 'all' | 'tshirts' | 'shirts' | 'jeans';
export type GenderType = 'all' | 'men' | 'women';

export interface Product {
  id: number;
  name: string;
  category: 'tshirts' | 'shirts' | 'jeans';
  gender: 'men' | 'women';
  price: number;
  originalPrice: number;
  sizes: string[];
  colors: string[];
  image: string;
  gallery: string[];
  description: string;
  fabric: string;
  fit: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

export interface CartItem {
  cartItemId: string; // unique key: productId-size-color
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface DemoOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  customer: CheckoutForm;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  estimatedDelivery: string;
}

export interface AnalyticsEvent {
  id: string;
  eventName: 'view_item_list' | 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase';
  timestamp: string;
  parameters: {
    productId?: number;
    productName?: string;
    category?: string;
    gender?: string;
    price?: number;
    size?: string;
    color?: string;
    quantity?: number;
    orderId?: string;
    value?: number;
    itemCount?: number;
    currency?: string;
  };
}

export type PageView = 
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'contact'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'about';
