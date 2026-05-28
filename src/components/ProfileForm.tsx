"use client";

import { useState, FormEvent, useEffect } from "react";

export default function ProfileForm({
  email,
  initialName,
  initialPhone,
  initialAddress,
}: {
  email: string;
  initialName: string;
  initialPhone: string;
  initialAddress: string;
}) {
  const [formData, setFormData] = useState({
    name: initialName,
    phone: initialPhone,
    address: initialAddress,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "儲存失敗，請重試");
      }
    } catch {
      alert("網路錯誤，請重試");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-5">
      <h2 className="font-display text-lg font-semibold text-text-primary">
        聯絡資料
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            姓名
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="請輸入姓名"
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            電話
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="請輸入聯絡電話"
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            住址
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="請輸入配送地址"
            rows={3}
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-sky focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            電子郵件
          </label>
          <input
            value={email}
            disabled
            className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-tertiary cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 font-semibold text-base transition-all ${
          loading
            ? "bg-accent-sky/50 text-white/50 cursor-not-allowed"
            : "bg-accent-sky text-white hover:bg-accent-sky/90 active:scale-[0.98]"
        }`}
      >
        {loading ? "儲存中..." : saved ? "已儲存！" : "儲存資料"}
      </button>
    </form>
  );
}
