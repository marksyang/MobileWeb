import { eq, sql, asc, and } from "drizzle-orm";
import { db } from "./index";
import { brands, phones, favorites, cartItems, orders, orderItems } from "./schema";
import type { Phone, Brand, CartItem } from "@/lib/types";

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

export async function getFavorites(userId: string): Promise<Phone[]> {
  const rows = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(asc(favorites.createdAt))
    .innerJoin(phones, eq(favorites.phoneId, phones.id));
  return rows.map((r) => mapPhoneRow(r.phones));
}

export async function isFavorite(userId: string, phoneId: string): Promise<boolean> {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.phoneId, phoneId)
      )
    );
  return (row?.count ?? 0) > 0;
}

export async function addFavorite(userId: string, phoneId: string) {
  const id = `${userId}-${phoneId}`;
  await db.insert(favorites).values({ id, userId, phoneId });
}

export async function removeFavorite(userId: string, phoneId: string) {
  const id = `${userId}-${phoneId}`;
  await db.delete(favorites).where(eq(favorites.id, id));
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .orderBy(asc(cartItems.createdAt))
    .innerJoin(phones, eq(cartItems.phoneId, phones.id));
  return rows.map((r) => ({
    phone: mapPhoneRow(r.phones),
    quantity: r.cartItems.quantity,
  }));
}

export async function getCartCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
  return row?.count ?? 0;
}

export async function getCartItem(userId: string, phoneId: string): Promise<{ phone: Phone; quantity: number } | undefined> {
  const [row] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.phoneId, phoneId)
      )
    )
    .innerJoin(phones, eq(cartItems.phoneId, phones.id))
    .limit(1);
  return row
    ? { phone: mapPhoneRow(row.phones), quantity: row.cartItems.quantity }
    : undefined;
}

export async function addToCart(userId: string, phoneId: string, quantity: number) {
  const id = `${userId}-${phoneId}`;
  const existing = await getCartItem(userId, phoneId);
  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id));
  } else {
    await db.insert(cartItems).values({ id, userId, phoneId, quantity });
  }
}

export async function updateCartQuantity(userId: string, phoneId: string, quantity: number) {
  const id = `${userId}-${phoneId}`;
  if (quantity <= 0) {
    await removeFromCart(userId, phoneId);
  } else {
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id));
  }
}

export async function removeFromCart(userId: string, phoneId: string) {
  const id = `${userId}-${phoneId}`;
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: string) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
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
  status: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: Date;
  items: OrderItem[];
}

export async function createOrder(
  userId: string,
  cartItemsList: { phoneId: string; phoneName: string; phoneImage: string; price: number; quantity: number }[],
  totalAmount: number,
  shippingName: string,
  shippingPhone: string,
  shippingAddress: string,
  paymentMethod: string
): Promise<Order> {
  const orderId = crypto.randomUUID();
  await db.insert(orders).values({
    id: orderId,
    userId,
    totalAmount,
    status: "pending",
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentMethod,
  });

  const orderItemsValues = cartItemsList.map((item, index) => ({
    id: `${orderId}-${index}`,
    orderId,
    phoneId: item.phoneId,
    phoneName: item.phoneName,
    phoneImage: item.phoneImage,
    price: item.price,
    quantity: item.quantity,
  }));

  await db.insert(orderItems).values(orderItemsValues);
  const items = await getOrderItems(orderId);

  return {
    id: orderId,
    userId,
    totalAmount,
    status: "pending",
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentMethod,
    createdAt: new Date(),
    items,
  };
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const rows = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    phoneId: r.phoneId,
    phoneName: r.phoneName,
    phoneImage: r.phoneImage,
    price: r.price,
    quantity: r.quantity,
  }));
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!row) return undefined;
  const items = await getOrderItems(orderId);
  return {
    id: row.id,
    userId: row.userId,
    totalAmount: row.totalAmount,
    status: row.status,
    shippingName: row.shippingName,
    shippingPhone: row.shippingPhone,
    shippingAddress: row.shippingAddress,
    paymentMethod: row.paymentMethod,
    createdAt: row.createdAt,
    items,
  };
}
