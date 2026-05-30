import { PHONE_DATA, BRANDS } from "./phone-data";

export { PHONE_DATA as phones, BRANDS } from "./phone-data";
export type { PhoneData as Phone, BrandData as Brand, PhoneSpecs, ReviewLink } from "./phone-data";

// Get top 20 phones by ranking
export function getTopPhones() {
  return PHONE_DATA
    .filter((p) => p.ranking)
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0))
    .slice(0, 20);
}

// Get phones by brand
export function getPhonesByBrand(brandId: string) {
  return PHONE_DATA.filter((p) => p.brand === brandId);
}

// Get phone by ID
export function getPhoneById(id: string) {
  return PHONE_DATA.find((p) => p.id === id);
}

// Get brand by ID
export function getBrandById(id: string) {
  return BRANDS.find((b) => b.id === id);
}
