import Link from "next/link";
import GitHubSignIn from "@/components/GitHubSignIn";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-8 text-center">
          <Link
            href="/"
            className="inline-block text-2xl font-bold font-display tracking-tight text-text-primary mb-6"
          >
            <span className="bg-gradient-to-r from-accent-sky to-accent-violet bg-clip-text text-transparent">
              MobileWeb
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            登入帳戶
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            使用 GitHub 帳號登入，即可收藏手機、管理個人列表
          </p>

          <GitHubSignIn />

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-text-tertiary transition-colors hover:text-text-secondary"
            >
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
