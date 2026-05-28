import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCartItems,
  getCartCount,
  getCartItem,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/db/queries";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const items = await getCartItems(session.user.id);
  const count = await getCartCount(session.user.id);

  return NextResponse.json({ items, count });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await request.json();
  const { phoneId, quantity, clear } = body as {
    phoneId?: string;
    quantity?: number;
    clear?: boolean;
  };

  // Clear entire cart
  if (clear) {
    await clearCart(session.user.id);
    return NextResponse.json({ success: true, count: 0 });
  }

  if (!phoneId) {
    return NextResponse.json({ error: "缺少 phoneId" }, { status: 400 });
  }

  const qty = quantity ?? 1;

  // Quantity 0 or negative means remove
  if (qty <= 0) {
    await removeFromCart(session.user.id, phoneId);
    const count = await getCartCount(session.user.id);
    return NextResponse.json({ success: true, removed: true, count });
  }

  // Add or update (upsert)
  await addToCart(session.user.id, phoneId, qty);
  const item = await getCartItem(session.user.id, phoneId);
  const count = await getCartCount(session.user.id);

  return NextResponse.json({
    success: true,
    item: { phone: item?.phone, quantity: item?.quantity },
    count,
  });
}
