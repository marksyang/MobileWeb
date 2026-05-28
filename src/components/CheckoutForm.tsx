"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ totalPrice }: { totalPrice: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingName: "マーク楊",
    shippingPhone: "0912-345-678",
    shippingAddress: "台北市大安區信義路四段123號6樓",
    paymentMethod: "credit_card",
    cardNumber: "4111 1111 1111 1111",
    cardExpiry: "12/28",
    cardCvv: "123",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName: formData.shippingName,
          shippingPhone: formData.shippingPhone,
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok && data.orderId) {
        router.push(`/checkout/success?orderId=${data.orderId}`);
      } else {
        alert(data.error || "結帳失敗，請重試");
        setLoading(false);
      }
    } catch {
      alert("網路錯誤，請重試");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-5">
      {/* Payment Method */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
          付款方式
        </h2>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border-subtle hover:border-border-glow transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="credit_card"
            checked
            readOnly
            className="accent-accent-sky"
          />
          <div>
            <p className="text-sm font-medium text-text-primary">信用卡 / 金融卡</p>
            <p className="text-xs text-text-tertiary">Visa / Master / JCB</p>
          </div>
        </label>
      </div>

      {/* Credit Card Info */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
          信用卡資料
        </h2>
        <div className="space-y-3">
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="卡片號碼"
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleChange}
              placeholder="有效期限"
              className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
            />
            <input
              name="cardCvv"
              value={formData.cardCvv}
              onChange={handleChange}
              placeholder="安全碼"
              className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3">
          配送資訊
        </h2>
        <div className="space-y-3">
          <input
            name="shippingName"
            value={formData.shippingName}
            onChange={handleChange}
            placeholder="收件人"
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
          />
          <input
            name="shippingPhone"
            value={formData.shippingPhone}
            onChange={handleChange}
            placeholder="聯絡電話"
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
          />
          <textarea
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            placeholder="配送地址"
            rows={3}
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-border-subtle pt-4 flex justify-between items-center">
        <span className="font-semibold text-text-primary">訂單總計</span>
        <span className="text-xl font-bold font-display text-accent-sky">
          NT${totalPrice.toLocaleString()}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 font-semibold text-base transition-all ${
          loading
            ? "bg-accent-sky/50 text-white/50 cursor-not-allowed"
            : "bg-accent-sky text-white hover:bg-accent-sky/90 active:scale-[0.98]"
        }`}
      >
        {loading ? "處理中..." : "確認付款"}
      </button>
    </form>
  );
}
