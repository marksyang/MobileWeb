import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrder } from "@/db/queries";
import type { Order } from "@/lib/types";

interface TrackingStep {
  label: string;
  description: string;
  completed: boolean;
}

function generateDummyTrackingSteps(orderStatus: Order["status"]): TrackingStep[] {
  const steps: TrackingStep[] = [
    { label: "訂單成立", description: "我們已收到您的訂單", completed: true },
    { label: "付款確認", description: "您的付款已成功處理", completed: orderStatus !== "cancelled" },
    { label: "商品準備中", description: "仓库正在準備您的商品", completed: ["shipped", "delivered"].includes(orderStatus) },
    { label: "出貨", description: "商品已由快遞取件", completed: ["shipped", "delivered"].includes(orderStatus) },
    { label: "送達", description: "商品已送達目的地", completed: orderStatus === "delivered" },
  ];
  return steps;
}

function generateDummyTrackingData(status: Order["status"]) {
  const now = new Date();
  const stepDates: (Date | null)[] = [];

  const orderDate = new Date(now);
  orderDate.setDate(now.getDate() - 3);
  orderDate.setHours(10, 0, 0, 0);
  stepDates.push(orderDate);

  const paymentDate = new Date(orderDate);
  paymentDate.setHours(10, 30, 0, 0);
  stepDates.push(["shipped", "delivered"].includes(status) ? paymentDate : null);

  const prepDate = new Date(orderDate);
  prepDate.setDate(orderDate.getDate() + 1);
  prepDate.setHours(14, 0, 0, 0);
  stepDates.push(["shipped", "delivered"].includes(status) ? prepDate : null);

  const shipDate = new Date(orderDate);
  shipDate.setDate(orderDate.getDate() + 2);
  shipDate.setHours(9, 0, 0, 0);
  stepDates.push(["shipped", "delivered"].includes(status) ? shipDate : null);

  const deliverDate = new Date(orderDate);
  deliverDate.setDate(orderDate.getDate() + 3);
  deliverDate.setHours(16, 0, 0, 0);
  stepDates.push(status === "delivered" ? deliverDate : null);

  return stepDates;
}

export default async function TrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await getOrder(orderId);
  if (!order || order.userId !== session.user.id) {
    redirect("/orders");
  }

  const steps = generateDummyTrackingSteps(order.status);
  const stepDates = generateDummyTrackingData(order.status);

  const statusLabels: Record<string, string> = {
    pending: "待處理",
    shipped: "運送中",
    delivered: "已送達",
    cancelled: "已取消",
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/orders" className="text-sm text-text-tertiary hover:text-accent-sky transition-colors">
            ← 返回訂單管理
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-text-primary">
            物流追蹤
          </h1>
        </div>

        {/* Order info */}
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                訂單 {order.id.slice(0, 8)}...
              </p>
              <p className="text-xs text-text-tertiary">
                {new Date(order.createdAt).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              <span className="text-text-tertiary">收件人：</span>{order.shippingName}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="text-text-tertiary">電話：</span>{order.shippingPhone}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="text-text-tertiary">地址：</span>{order.shippingAddress}
            </p>
          </div>

          {order.status !== "pending" && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-xs text-text-tertiary mb-2">物流資訊</p>
              <p className="text-sm text-text-secondary">
                <span className="text-text-tertiary">物流 company：</span>黑貓宅急便
              </p>
              <p className="text-sm text-text-secondary">
                <span className="text-text-tertiary">追蹤編號：</span>
                <code className="ml-1 px-2 py-0.5 rounded bg-bg-secondary text-text-primary font-mono text-xs">
                  HW{order.id.slice(0, 6).toUpperCase()}2026
                </code>
              </p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-5">
            物流進度
          </h2>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      step.completed
                        ? "bg-accent-sky border-accent-sky"
                        : "bg-bg-primary border-text-tertiary"
                    }`}
                  />
                  {i < steps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[20px] ${
                        step.completed ? "bg-accent-sky" : "bg-border-subtle"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-4">
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-text-primary" : "text-text-tertiary"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-text-tertiary">{step.description}</p>
                  {stepDates[i] && (
                    <p className="text-xs text-text-tertiary mt-1">
                      {stepDates[i]!.toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
