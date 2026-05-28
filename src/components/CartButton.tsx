"use client";

import { useState, useCallback } from "react";

export default function CartButton({
  phoneId,
  phoneName,
  price,
  initialInCart = false,
  initialQuantity = 1,
}: {
  phoneId: string;
  phoneName: string;
  price: number;
  initialInCart?: boolean;
  initialQuantity?: number;
}) {
  const [inCart, setInCart] = useState(initialInCart);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading) return;

      setLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneId, quantity }),
        });
        const data = await res.json();
        if (data.success) {
          setInCart(true);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1500);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    },
    [phoneId, quantity, loading]
  );

  const changeQuantity = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    // If already in cart, update quantity on server
    if (inCart) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneId, quantity: newQty }),
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {/* Quantity selector */}
        <div className="flex items-center rounded-lg border border-border-subtle bg-bg-secondary">
          <button
            onClick={(e) => {
              e.preventDefault();
              changeQuantity(quantity - 1);
            }}
            disabled={quantity <= 1}
            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-10 text-center text-sm font-semibold text-text-primary">
            {quantity}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              changeQuantity(quantity + 1);
            }}
            disabled={quantity >= 99}
            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={addToCart}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            justAdded
              ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
              : inCart
                ? "bg-accent-sky/10 text-accent-sky border border-accent-sky/30 hover:bg-accent-sky/20"
                : "bg-accent-sky text-white hover:bg-accent-sky/90 border border-accent-sky"
          } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {justAdded ? "已加入" : inCart ? "已加入購物車" : "加入購物車"}
        </button>
      </div>

      {inCart && (
        <p className="text-xs text-text-tertiary">
          小計: NT${(price * quantity).toLocaleString()}
        </p>
      )}
    </div>
  );
}
