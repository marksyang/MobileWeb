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

export interface ReviewLink {
  platform: "YouTube" | "Facebook" | "Instagram" | "TikTok";
  title: string;
  url: string;
}

// Brand image colors for placeholders
const BRAND_COLORS: Record<string, { bg: string; fg: string }> = {
  apple: { bg: "1a1a2e", fg: "e0e0e0" },
  samsung: { bg: "0f172a", fg: "38bdf8" },
  xiaomi: { bg: "1c1000", fg: "fbbf24" },
  huawei: { bg: "1c0a10", fg: "fb7185" },
  oppo: { bg: "041c14", fg: "34d399" },
  vivo: { bg: "0c1426", fg: "818cf8" },
  oneplus: { bg: "1c0a0a", fg: "fb7185" },
  google: { bg: "0c0c26", fg: "818cf8" },
};

const img = (brand: string, name: string) =>
  `https://placehold.co/600x800/${BRAND_COLORS[brand]?.bg || "1a1a2e"}/${BRAND_COLORS[brand]?.fg || "e0e0e0"}.png?text=${encodeURIComponent(name)}`;

export const BRANDS = [
  { id: "apple", name: "Apple", logo: "🍎" },
  { id: "samsung", name: "Samsung", logo: "⭐" },
  { id: "xiaomi", name: "Xiaomi", logo: "🟠" },
  { id: "huawei", name: "Huawei", logo: "🌸" },
  { id: "oppo", name: "OPPO", logo: "💚" },
  { id: "vivo", name: "vivo", logo: "💙" },
  { id: "oneplus", name: "OnePlus", logo: "🔴" },
  { id: "google", name: "Google", logo: "🔵" },
];

export const phones: Phone[] = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "apple",
    image: img("apple", "iPhone 16 Pro Max"),
    images: [img("apple", "iPhone 16 Pro Max"), img("apple", "Front View"), img("apple", "Side View")],
    msrp: 69900,
    price: 64900,
    ranking: 1,
    specs: {
      dimensions: "160 x 77.6 x 8.25 mm",
      weight: "227g",
      display: '6.9" Super Retina XDR OLED',
      resolution: "2868 x 1320 px, 460 ppi",
      processor: "Apple A18 Pro (3nm)",
      gpu: "6-core GPU",
      ram: "8GB",
      storage: "256GB / 512GB / 1TB",
      rearCamera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto (5x)",
      frontCamera: "12MP TrueDepth",
      battery: "4685 mAh, USB-C PD 45W",
      os: "iOS 18",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.3, UWB",
    },
    reviewLinks: [
      { platform: "YouTube", title: "iPhone 16 Pro Max 完整評測", url: "https://youtube.com" },
      { platform: "Facebook", title: "iPhone 16 Pro Max 使用心得", url: "https://facebook.com" },
    ],
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "apple",
    image: img("apple", "iPhone 16 Pro"),
    images: [img("apple", "iPhone 16 Pro"), img("apple", "Back View")],
    msrp: 61900,
    price: 57900,
    ranking: 3,
    specs: {
      dimensions: "149.6 x 71.5 x 8.25 mm",
      weight: "199g",
      display: '6.3" Super Retina XDR OLED',
      resolution: "2622 x 1206 px, 460 ppi",
      processor: "Apple A18 Pro (3nm)",
      gpu: "6-core GPU",
      ram: "8GB",
      storage: "128GB / 256GB / 512GB / 1TB",
      rearCamera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto (5x)",
      frontCamera: "12MP TrueDepth",
      battery: "3582 mAh, USB-C PD 45W",
      os: "iOS 18",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.3, UWB",
    },
    reviewLinks: [
      { platform: "YouTube", title: "iPhone 16 Pro 評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    brand: "apple",
    image: img("apple", "iPhone 16"),
    images: [img("apple", "iPhone 16")],
    msrp: 41900,
    price: 39900,
    ranking: 5,
    specs: {
      dimensions: "147.6 x 71.6 x 7.8 mm",
      weight: "170g",
      display: '6.1" Super Retina XDR OLED',
      resolution: "2556 x 1179 px, 460 ppi",
      processor: "Apple A18 (3nm)",
      gpu: "5-core GPU",
      ram: "8GB",
      storage: "128GB / 256GB / 512GB",
      rearCamera: "48MP Main + 12MP Ultra Wide",
      frontCamera: "12MP TrueDepth",
      battery: "3561 mAh, USB-C PD 20W",
      os: "iOS 18",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    reviewLinks: [
      { platform: "YouTube", title: "iPhone 16 值得買嗎？", url: "https://youtube.com" },
      { platform: "Instagram", title: "iPhone 16 開箱", url: "https://instagram.com" },
    ],
  },
  {
    id: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra",
    brand: "samsung",
    image: img("samsung", "Galaxy S25 Ultra"),
    images: [img("samsung", "Galaxy S25 Ultra"), img("samsung", "Back View")],
    msrp: 59900,
    price: 54900,
    ranking: 2,
    specs: {
      dimensions: "162.6 x 79.3 x 8.2 mm",
      weight: "218g",
      display: '6.9" Dynamic AMOLED 2X',
      resolution: "3120 x 1440 px, Quad HD+",
      processor: "Qualcomm Snapdragon 8 Elite",
      gpu: "Adreno 830",
      ram: "12GB",
      storage: "256GB / 512GB / 1TB",
      rearCamera: "200MP Main + 50MP Telephoto (5x) + 10MP Telephoto (3x) + 12MP Ultra Wide",
      frontCamera: "12MP",
      battery: "5000 mAh, 45W PD",
      os: "Android 15 (One UI 7)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "S25 Ultra 完整評測", url: "https://youtube.com" },
      { platform: "YouTube", title: "S25 Ultra 相機實測", url: "https://youtube.com" },
      { platform: "Facebook", title: "S25 Ultra 使用一個月", url: "https://facebook.com" },
    ],
  },
  {
    id: "galaxy-s25+",
    name: "Galaxy S25+",
    brand: "samsung",
    image: img("samsung", "Galaxy S25+"),
    images: [img("samsung", "Galaxy S25+")],
    msrp: 49900,
    price: 45900,
    ranking: 7,
    specs: {
      dimensions: "158.4 x 75.8 x 7.3 mm",
      weight: "190g",
      display: '6.7" Dynamic AMOLED 2X',
      resolution: "3120 x 1440 px, Quad HD+",
      processor: "Qualcomm Snapdragon 8 Elite",
      gpu: "Adreno 830",
      ram: "12GB",
      storage: "256GB / 512GB",
      rearCamera: "50MP Main + 10MP Telephoto (3x) + 12MP Ultra Wide",
      frontCamera: "12MP",
      battery: "4900 mAh, 45W PD",
      os: "Android 15 (One UI 7)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "S25+ 評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "galaxy-z-fold6",
    name: "Galaxy Z Fold6",
    brand: "samsung",
    image: img("samsung", "Galaxy Z Fold6"),
    images: [img("samsung", "Galaxy Z Fold6")],
    msrp: 79900,
    price: 72900,
    ranking: 12,
    specs: {
      dimensions: "153.5 x 132.6 x 5.6 mm (unfolded)",
      weight: "194g",
      display: '7.6" Foldable Dynamic AMOLED 2X (inner) / 6.3" outer',
      resolution: "2160 x 1856 px",
      processor: "Qualcomm Snapdragon 8 Gen 3",
      gpu: "Adreno 750",
      ram: "12GB",
      storage: "256GB / 512GB / 1TB",
      rearCamera: "50MP Main + 10MP Telephoto (3x) + 12MP Ultra Wide",
      frontCamera: "10MP / 4MP cover",
      battery: "4400 mAh, 25W PD",
      os: "Android 14 (One UI 6.1.1)",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    reviewLinks: [
      { platform: "YouTube", title: "Z Fold6 折疊機評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "xiaomi-15-ultra",
    name: "Xiaomi 15 Ultra",
    brand: "xiaomi",
    image: img("xiaomi", "Xiaomi 15 Ultra"),
    images: [img("xiaomi", "Xiaomi 15 Ultra")],
    msrp: 44900,
    price: 39900,
    ranking: 4,
    specs: {
      dimensions: "161.1 x 75.4 x 9.2 mm",
      weight: "222g",
      display: '6.73" LTPO OLED',
      resolution: "3200 x 1440 px, 2K",
      processor: "Qualcomm Snapdragon 8 Elite",
      gpu: "Adreno 830",
      ram: "16GB LPDDR5X",
      storage: "512GB / 1TB UFS 4.0",
      rearCamera: "Leica Summilux 50MP Main + 50MP Telephoto + 50MP Ultra Wide + 50MP Periscope",
      frontCamera: "32MP",
      battery: "5400 mAh, 90W Wired / 80W Wireless",
      os: "HyperOS 2 (Android 15)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4, NFC",
    },
    reviewLinks: [
      { platform: "YouTube", title: "小米 15 Ultra 相機評測", url: "https://youtube.com" },
      { platform: "TikTok", title: "小米 Ultra 開箱", url: "https://tiktok.com" },
    ],
  },
  {
    id: "xiaomi-redmi-note-14-pro",
    name: "Redmi Note 14 Pro+",
    brand: "xiaomi",
    image: img("xiaomi", "Redmi Note 14 Pro+"),
    images: [img("xiaomi", "Redmi Note 14 Pro+")],
    msrp: 16900,
    price: 14900,
    ranking: 8,
    specs: {
      dimensions: "161.8 x 77.4 x 8.8 mm",
      weight: "204g",
      display: '6.67" AMOLED',
      resolution: "2712 x 1220 px, FHD+",
      processor: "MediaTek Dimensity 7300 Ultra",
      gpu: "Mali-G615 MC2",
      ram: "12GB",
      storage: "256GB / 512GB",
      rearCamera: "50MP Main + 8MP Ultra Wide + 2MP Macro",
      frontCamera: "20MP",
      battery: "6200 mAh, 90W PD",
      os: "HyperOS (Android 14)",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.4, NFC",
    },
    reviewLinks: [
      { platform: "YouTube", title: "性價比之王？Redmi Note 14 Pro+", url: "https://youtube.com" },
    ],
  },
  {
    id: "pixel-9-pro",
    name: "Pixel 9 Pro",
    brand: "google",
    image: img("google", "Pixel 9 Pro"),
    images: [img("google", "Pixel 9 Pro")],
    msrp: 46900,
    price: 42900,
    ranking: 6,
    specs: {
      dimensions: "152.8 x 74.5 x 8.5 mm",
      weight: "199g",
      display: '6.3" LTPO OLED',
      resolution: "2856 x 1280 px",
      processor: "Google Tensor G4",
      gpu: "Mali-G715 MC7",
      ram: "16GB",
      storage: "128GB / 256GB / 512GB",
      rearCamera: "50MP Main + 48MP Telephoto (5x) + 48MP Ultra Wide",
      frontCamera: "42MP",
      battery: "4720 mAh, 30W PD",
      os: "Android 14",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "Pixel 9 Pro AI 功能大推", url: "https://youtube.com" },
      { platform: "Instagram", title: "Pixel 9 Pro 拍照實測", url: "https://instagram.com" },
    ],
  },
  {
    id: "oppo-find-x8",
    name: "OPPO Find X8 Ultra",
    brand: "oppo",
    image: img("oppo", "Find X8 Ultra"),
    images: [img("oppo", "Find X8 Ultra")],
    msrp: 47900,
    price: 43900,
    ranking: 9,
    specs: {
      dimensions: "162.3 x 76.2 x 9.1 mm",
      weight: "220g",
      display: '6.82" LTPO AMOLED',
      resolution: "3168 x 1410 px, 2K",
      processor: "Qualcomm Snapdragon 8 Elite",
      gpu: "Adreno 830",
      ram: "16GB",
      storage: "512GB / 1TB",
      rearCamera: "Hasselblad 50MP Main + 50MP Periscope (6x) + 50MP Ultra Wide + 50MP Telephoto",
      frontCamera: "32MP",
      battery: "5600 mAh, 100W PD / 50W Wireless",
      os: "ColorOS 15 (Android 15)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "Find X8 Ultra 哈蘇相機評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "vivo-x200-pro",
    name: "vivo X200 Pro",
    brand: "vivo",
    image: img("vivo", "vivo X200 Pro"),
    images: [img("vivo", "vivo X200 Pro")],
    msrp: 42900,
    price: 38900,
    ranking: 10,
    specs: {
      dimensions: "162.4 x 77.0 x 8.5 mm",
      weight: "223g",
      display: '6.78" LTPO AMOLED',
      resolution: "2800 x 1260 px",
      processor: "MediaTek Dimensity 9400",
      gpu: "Immortalis-G925",
      ram: "16GB LPDDR5X",
      storage: "256GB / 512GB / 1TB",
      rearCamera: "Zeiss 50MP Main + 200MP Periscope (200MP) + 50MP Ultra Wide",
      frontCamera: "32MP",
      battery: "6100 mAh, 90W PD / 30W Wireless",
      os: "OriginOS 5 (Android 15)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "vivo X200 Pro 蔡司鏡頭評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "oneplus-13",
    name: "OnePlus 13",
    brand: "oneplus",
    image: img("oneplus", "OnePlus 13"),
    images: [img("oneplus", "OnePlus 13")],
    msrp: 39900,
    price: 35900,
    ranking: 11,
    specs: {
      dimensions: "162.9 x 77.4 x 8.5 mm",
      weight: "213g",
      display: '6.82" LTPO AMOLED',
      resolution: "3168 x 1410 px, 2K",
      processor: "Qualcomm Snapdragon 8 Elite",
      gpu: "Adreno 830",
      ram: "12GB / 16GB LPDDR5X",
      storage: "256GB / 512GB / 1TB",
      rearCamera: "Hasselblad 50MP Main + 50MP Ultra Wide + 50MP Telephoto (3x)",
      frontCamera: "32MP",
      battery: "6000 mAh, 100W PD",
      os: "OxygenOS 15 (Android 15)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "OnePlus 13 評測 — Never Settle", url: "https://youtube.com" },
      { platform: "Facebook", title: "OnePlus 13 使用心得", url: "https://facebook.com" },
    ],
  },
  {
    id: "huawei-pura-80-ultra",
    name: "Huawei Pura 80 Ultra",
    brand: "huawei",
    image: img("huawei", "Pura 80 Ultra"),
    images: [img("huawei", "Pura 80 Ultra")],
    msrp: 55900,
    price: 49900,
    ranking: 13,
    specs: {
      dimensions: "163.0 x 76.5 x 8.4 mm",
      weight: "221g",
      display: '6.8" LTPO OLED',
      resolution: "2844 x 1260 px",
      processor: "Kirin 9100",
      gpu: "Maleoon 910",
      ram: "16GB",
      storage: "512GB / 1TB",
      rearCamera: "XMAGE 50MP Main + 50MP Periscope (5x) + 40MP Ultra Wide",
      frontCamera: "13MP",
      battery: "5600 mAh, 100W PD / 50W Wireless",
      os: "HarmonyOS 6",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "華為 Pura 80 Ultra XMAGE 評測", url: "https://youtube.com" },
    ],
  },
  {
    id: "galaxy-a56",
    name: "Galaxy A56",
    brand: "samsung",
    image: img("samsung", "Galaxy A56"),
    images: [img("samsung", "Galaxy A56")],
    msrp: 19900,
    price: 17900,
    ranking: 14,
    specs: {
      dimensions: "161.8 x 77.5 x 6.9 mm",
      weight: "168g",
      display: '6.7" Super AMOLED',
      resolution: "2340 x 1080 px, FHD+",
      processor: "Exynos 1580",
      gpu: "Xclipse 5",
      ram: "8GB / 12GB",
      storage: "128GB / 256GB",
      rearCamera: "50MP Main + 12MP Ultra Wide + 5MP Macro",
      frontCamera: "12MP",
      battery: "5000 mAh, 25W PD",
      os: "Android 15 (One UI 7)",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "中階機首選 Galaxy A56", url: "https://youtube.com" },
    ],
  },
  {
    id: "pixel-9",
    name: "Pixel 9",
    brand: "google",
    image: img("google", "Pixel 9"),
    images: [img("google", "Pixel 9")],
    msrp: 36900,
    price: 33900,
    ranking: 15,
    specs: {
      dimensions: "152.3 x 72.1 x 8.5 mm",
      weight: "198g",
      display: '6.3" OLED',
      resolution: "2424 x 1080 px",
      processor: "Google Tensor G4",
      gpu: "Mali-G715 MC7",
      ram: "12GB",
      storage: "128GB / 256GB",
      rearCamera: "50MP Main + 48MP Ultra Wide",
      frontCamera: "10.5MP",
      battery: "4700 mAh, 27W PD",
      os: "Android 14",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "Pixel 9 純血 Android 體驗", url: "https://youtube.com" },
    ],
  },
  {
    id: "iphone-16-plus",
    name: "iPhone 16 Plus",
    brand: "apple",
    image: img("apple", "iPhone 16 Plus"),
    images: [img("apple", "iPhone 16 Plus")],
    msrp: 49900,
    price: 46900,
    ranking: 16,
    specs: {
      dimensions: "160.0 x 77.6 x 7.8 mm",
      weight: "199g",
      display: '6.7" Super Retina XDR OLED',
      resolution: "2796 x 1290 px, 460 ppi",
      processor: "Apple A18 (3nm)",
      gpu: "5-core GPU",
      ram: "8GB",
      storage: "128GB / 256GB / 512GB",
      rearCamera: "48MP Main + 12MP Ultra Wide",
      frontCamera: "12MP TrueDepth",
      battery: "4674 mAh, USB-C PD 20W",
      os: "iOS 18",
      connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    reviewLinks: [
      { platform: "YouTube", title: "iPhone 16 Plus 大螢幕體驗", url: "https://youtube.com" },
    ],
  },
  {
    id: "oppo-reno-12-pro",
    name: "OPPO Reno 12 Pro",
    brand: "oppo",
    image: img("oppo", "Reno 12 Pro"),
    images: [img("oppo", "Reno 12 Pro")],
    msrp: 24900,
    price: 21900,
    ranking: 17,
    specs: {
      dimensions: "162.1 x 75.0 x 7.4 mm",
      weight: "180g",
      display: '6.7" AMOLED',
      resolution: "2412 x 1080 px, FHD+",
      processor: "MediaTek Dimensity 8250",
      gpu: "Mali-G615 MC6",
      ram: "12GB",
      storage: "256GB / 512GB",
      rearCamera: "50MP Main + 8MP Ultra Wide + AI Lens",
      frontCamera: "32MP",
      battery: "5800 mAh, 80W PD",
      os: "ColorOS 14 (Android 14)",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "Facebook", title: "Reno 12 Pro 自拍之王", url: "https://facebook.com" },
    ],
  },
  {
    id: "vivo-y200",
    name: "vivo Y200",
    brand: "vivo",
    image: img("vivo", "vivo Y200"),
    images: [img("vivo", "vivo Y200")],
    msrp: 12900,
    price: 10900,
    ranking: 18,
    specs: {
      dimensions: "161.5 x 75.7 x 7.7 mm",
      weight: "186g",
      display: '6.67" AMOLED',
      resolution: "2408 x 1080 px, FHD+",
      processor: "Snapdragon 680",
      gpu: "Adreno 610",
      ram: "8GB",
      storage: "128GB / 256GB",
      rearCamera: "64MP Main + 2MP Depth",
      frontCamera: "8MP",
      battery: "5000 mAh, 44W PD",
      os: "Funtouch OS 14 (Android 14)",
      connectivity: "4G LTE, Wi-Fi 5, Bluetooth 5.2",
    },
    reviewLinks: [
      { platform: "YouTube", title: "性價比平民機 vivo Y200", url: "https://youtube.com" },
    ],
  },
  {
    id: "oneplus-nord-5",
    name: "OnePlus Nord CE 5",
    brand: "oneplus",
    image: img("oneplus", "Nord CE 5"),
    images: [img("oneplus", "Nord CE 5")],
    msrp: 15900,
    price: 13900,
    ranking: 19,
    specs: {
      dimensions: "162.3 x 76.3 x 8.1 mm",
      weight: "193g",
      display: '6.7" AMOLED',
      resolution: "2400 x 1080 px, FHD+",
      processor: "Snapdragon 7 Gen 3",
      gpu: "Adreno 720",
      ram: "8GB / 12GB",
      storage: "128GB / 256GB",
      rearCamera: "50MP Main + 8MP Ultra Wide",
      frontCamera: "16MP",
      battery: "5500 mAh, 80W PD",
      os: "OxygenOS 14 (Android 14)",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.4",
    },
    reviewLinks: [
      { platform: "YouTube", title: "Nord CE 5 中階機推薦", url: "https://youtube.com" },
    ],
  },
  {
    id: "huawei-nova-13",
    name: "Huawei Nova 13",
    brand: "huawei",
    image: img("huawei", "Nova 13"),
    images: [img("huawei", "Nova 13")],
    msrp: 27900,
    price: 24900,
    ranking: 20,
    specs: {
      dimensions: "161.3 x 74.5 x 6.8 mm",
      weight: "169g",
      display: '6.7" OLED',
      resolution: "2412 x 1084 px, FHD+",
      processor: "Kirin 8000",
      gpu: "Maleoon 800",
      ram: "8GB / 12GB",
      storage: "256GB / 512GB",
      rearCamera: "XMAGE 50MP Main + 8MP Ultra Wide",
      frontCamera: "60MP",
      battery: "4600 mAh, 66W PD",
      os: "HarmonyOS 5",
      connectivity: "5G, Wi-Fi 6, Bluetooth 5.2",
    },
    reviewLinks: [
      { platform: "Facebook", title: "Nova 13 輕薄美型機", url: "https://facebook.com" },
    ],
  },
];

// Get top 20 phones by ranking
export function getTopPhones(): Phone[] {
  return phones
    .filter((p) => p.ranking)
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0))
    .slice(0, 20);
}

// Get phones by brand
export function getPhonesByBrand(brandId: string): Phone[] {
  return phones.filter((p) => p.brand === brandId);
}

// Get phone by ID
export function getPhoneById(id: string): Phone | undefined {
  return phones.find((p) => p.id === id);
}

// Get brand by ID
export function getBrandById(id: string) {
  return BRANDS.find((b) => b.id === id);
}
