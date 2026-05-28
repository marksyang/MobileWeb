"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("確定要取消此訂單嗎？")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "取消失敗，請重試");
      }
    } catch {
      alert("網路錯誤，請重試");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        loading
          ? "bg-accent-rose/30 text-white/50 cursor-not-allowed"
          : "border border-accent-rose text-accent-rose hover:bg-accent-rose hover:text-white"
      }`}
    >
      {loading ? "處理中..." : "取消訂單"}
    </button>
  );
}
