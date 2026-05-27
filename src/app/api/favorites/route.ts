import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isFavorite, addFavorite, removeFavorite } from "@/db/queries";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await request.json();
  const { phoneId } = body as { phoneId: string };

  if (!phoneId) {
    return NextResponse.json({ error: "缺少 phoneId" }, { status: 400 });
  }

  const favorite = await isFavorite(session.user.id, phoneId);

  if (favorite) {
    await removeFavorite(session.user.id, phoneId);
  } else {
    await addFavorite(session.user.id, phoneId);
  }

  return NextResponse.json({ favorite: !favorite });
}
