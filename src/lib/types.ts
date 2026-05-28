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
