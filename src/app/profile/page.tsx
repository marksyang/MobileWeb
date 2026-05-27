import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          個人資料
        </h1>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-8 animate-slide-up">
        <div className="flex flex-col items-center text-center">
          {user.image && (
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-border-subtle">
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          )}

          <h2 className="font-display text-2xl font-bold text-text-primary">
            {user.name}
          </h2>

          {user.email && (
            <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
          )}

          <div className="mt-8 w-full space-y-3">
            <Link
              href="/favorites"
              className="flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-glow hover:bg-bg-card-hover hover:text-text-primary"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              查看我的收藏
            </Link>

            <SignOutButton className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-rose/20 bg-accent-rose/5 px-4 py-3 text-sm font-medium text-accent-rose transition-all hover:bg-accent-rose/10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              登出
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
