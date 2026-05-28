import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrders, cancelOrder } from "@/db/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const ordersList = await getOrders(session.user.id);
  return NextResponse.json({ orders: ordersList });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const body = await request.json();
  const { orderId } = body as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: "缺少訂單 ID" }, { status: 400 });
  }
  const success = await cancelOrder(orderId, session.user.id);
  if (!success) {
    return NextResponse.json({ error: "無法取消此訂單" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
