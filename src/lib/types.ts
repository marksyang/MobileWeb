export interface PhoneSpecs {
  dimensions: string;
  weight: string;
  display: string;
  resolution: string;
  processor: string;
  gpu: string;
  ram: string;
  storage: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  os: string;
  connectivity: string;
}

export interface ReviewLink {
  platform: "YouTube" | "Facebook" | "Instagram" | "TikTok";
  title: string;
  url: string;
}

export interface Phone {
  id: string;
  name: string;
  brand: string;
  image: string;
  images: string[];
  msrp: number;
  price: number;
  ranking?: number;
  specs: PhoneSpecs;
  reviewLinks: ReviewLink[];
}

export interface CartItem {
  phone: Phone;
  quantity: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  phoneId: string;
  phoneName: string;
  phoneImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: Date;
  items: OrderItem[];
}

export interface UserProfile {
  userId: string;
  name: string | null;
  phone: string | null;
  address: string | null;
}
