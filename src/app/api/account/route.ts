import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProfile, upsertUserProfile } from "@/db/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const profile = await getUserProfile(session.user.id);
  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const body = await request.json();
  const { name, phone, address } = body as { name?: string; phone?: string; address?: string };
  if (!name) {
    return NextResponse.json({ error: "請填寫姓名" }, { status: 400 });
  }
  const profile = await upsertUserProfile(session.user.id, name ?? "", phone ?? "", address ?? "");
  return NextResponse.json({ success: true, profile });
}
