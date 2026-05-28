import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCartItems, clearCart, createOrder } from "@/db/queries";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const cartItems = await getCartItems(session.user.id);

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "購物車是空的" }, { status: 400 });
  }

  const body = await request.json();
  const {
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentMethod,
  } = body as {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  };

  if (!shippingName || !shippingPhone || !shippingAddress || !paymentMethod) {
    return NextResponse.json({ error: "請填寫所有必填欄位" }, { status: 400 });
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );

  // Create order from cart
  const order = await createOrder(
    session.user.id,
    cartItems.map((item) => ({
      phoneId: item.phone.id,
      phoneName: item.phone.name,
      phoneImage: item.phone.image,
      price: item.phone.price,
      quantity: item.quantity,
    })),
    totalPrice,
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentMethod
  );

  // Clear cart after order creation
  await clearCart(session.user.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}
