import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/db/queries";
import ProfileForm from "@/components/ProfileForm";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getUserProfile(session.user.id);
  const initialName = profile?.name ?? session.user.name ?? "";
  const initialPhone = profile?.phone ?? "";
  const initialAddress = profile?.address ?? "";

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-text-tertiary hover:text-accent-sky transition-colors">
            ← 返回首頁
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-text-primary">
            帳戶管理
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            管理您的個人聯絡資料，用於配送和客服聯繫
          </p>
        </div>

        <ProfileForm
          email={session.user.email ?? ""}
          initialName={initialName}
          initialPhone={initialPhone}
          initialAddress={initialAddress}
        />
      </div>
    </div>
  );
}
