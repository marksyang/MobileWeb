import { eq, sql, asc } from "drizzle-orm";
import { db } from "./index";
import { brands, phones } from "./schema";
import type { Phone, Brand } from "@/lib/types";

export async function getAllBrands(): Promise<Brand[]> {
  const rows = await db.select().from(brands);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logo: r.logo,
  }));
}

export async function getBrandById(id: string): Promise<Brand | undefined> {
  const [row] = await db
    .select()
    .from(brands)
    .where(eq(brands.id, id))
    .limit(1);
  return row
    ? { id: row.id, name: row.name, logo: row.logo }
    : undefined;
}

export async function getTopPhones(): Promise<Phone[]> {
  const rows = await db
    .select()
    .from(phones)
    .where(sql`${phones.ranking} IS NOT NULL`)
    .orderBy(asc(phones.ranking))
    .limit(20);
  return mapPhoneRows(rows);
}

export async function getPhonesByBrand(brandId: string): Promise<Phone[]> {
  const rows = await db
    .select()
    .from(phones)
    .where(eq(phones.brandId, brandId));
  return mapPhoneRows(rows);
}

export async function getPhoneById(id: string): Promise<Phone | undefined> {
  const [row] = await db
    .select()
    .from(phones)
    .where(eq(phones.id, id))
    .limit(1);
  return row ? mapPhoneRow(row) : undefined;
}

function mapPhoneRow(r: any): Phone {
  return {
    id: r.id,
    name: r.name,
    brand: r.brandId,
    image: r.image,
    images: (r.images as string[]) ?? [],
    msrp: r.msrp ?? 0,
    price: r.price ?? 0,
    ranking: r.ranking ?? undefined,
    specs: r.specs as Phone["specs"],
    reviewLinks: (r.reviewLinks as Phone["reviewLinks"]) ?? [],
  };
}

function mapPhoneRows(rows: any[]): Phone[] {
  return rows.map(mapPhoneRow);
}
