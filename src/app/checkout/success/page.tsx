import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrder } from "@/db/queries";
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orderId = searchParams.orderId;
  if (!orderId) {
    redirect("/");
  }

  const order = await getOrder(orderId);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <section className="mb-10 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-emerald/10 mb-4">
          <svg
            className="h-8 w-8 text-accent-emerald"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary">
          訂單成功
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          感謝您的購買，我們已收到您的訂單
        </p>
      </section>

      {order && (
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              訂單明細
            </h2>
            <span className="text-xs text-text-tertiary">
              {order.id.slice(0, 8).toUpperCase()}...
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
              >
                <img
                  src={item.phoneImage}
                  alt={item.phoneName}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {item.phoneName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    數量: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  NT${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border-subtle pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">付款方式</span>
              <span className="text-text-primary">信用卡 / 金融卡</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">收件人</span>
              <span className="text-text-primary">{order.shippingName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">聯絡電話</span>
              <span className="text-text-primary">{order.shippingPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">配送地址</span>
              <span className="text-text-primary text-right max-w-[200px]">
                {order.shippingAddress}
              </span>
            </div>
            <div className="border-t border-border-subtle pt-3 flex justify-between">
              <span className="font-semibold text-text-primary">總計</span>
              <span className="text-xl font-bold font-display text-accent-sky">
                NT${order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-accent-sky px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-sky/90 transition-colors"
        >
          繼續購物
        </Link>
      </div>
    </div>
  );
}
