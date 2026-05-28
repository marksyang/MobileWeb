import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrders } from "@/db/queries";
import OrderCard from "@/components/OrderCard";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getOrders(session.user.id);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-text-tertiary hover:text-accent-sky transition-colors">
            ← 返回首頁
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-text-primary">
            訂單管理
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            查看您的訂單狀態並管理訂單
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-text-tertiary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 16v1a3 3 0 006 0v-1m-6 0L20 20M12 4a8 8 0 100 16 8 8 0 000-16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              還沒有任何訂單
            </h2>
            <p className="text-sm text-text-tertiary mb-6">
              開始選購手機，建立您的第一筆訂單
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl px-6 py-2.5 bg-accent-sky text-white text-sm font-semibold hover:bg-accent-sky/90 transition-colors"
            >
              開始選購
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
