import Link from "next/link";
import Image from "next/image";
import CancelOrderButton from "./CancelOrderButton";
import type { Order } from "@/lib/types";

const statusLabels: Record<string, string> = {
  pending: "待處理",
  shipped: "運送中",
  delivered: "已送達",
  cancelled: "已取消",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export default function OrderCard({ order }: { order: Order }) {
  const dateStr = new Date(order.createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            訂單 {order.id.slice(0, 8)}...
          </p>
          <p className="text-xs text-text-tertiary">{dateStr}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-slate-100 text-slate-600"}`}>
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden border border-border-subtle flex-shrink-0 bg-bg-secondary">
              <Image
                src={item.phoneImage}
                alt={item.phoneName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {item.phoneName}
              </p>
              <p className="text-xs text-text-tertiary">
                NT${item.price.toLocaleString()} x {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-text-primary">
              NT${(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border-subtle bg-bg-secondary/50 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-tertiary">訂單總計</p>
          <p className="text-lg font-bold font-display text-accent-sky">
            NT${order.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <CancelOrderButton orderId={order.id} />
          )}
          <Link
            href={`/orders/${order.id}/tracking`}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border-subtle text-text-secondary hover:bg-bg-card-hover transition-all"
          >
            查看物流
          </Link>
        </div>
      </div>
    </div>
  );
}
