"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/types";

export default function CartItemRow({
  item,
  initialCount,
}: {
  item: CartItem;
  initialCount: number;
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [count, setCount] = useState(initialCount);
  const [removing, setRemoving] = useState(false);

  const updateQuantity = useCallback(
    async (newQty: number) => {
      if (newQty < 1) return;
      setQuantity(newQty);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneId: item.phone.id, quantity: newQty }),
        });
        const data = await res.json();
        if (data.count !== undefined) setCount(data.count);
      } catch {
        // revert on failure
        setQuantity(item.quantity);
      }
    },
    [item]
  );

  const remove = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (removing) return;
      setRemoving(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneId: item.phone.id, quantity: 0 }),
        });
        const data = await res.json();
        if (data.count !== undefined) setCount(data.count);
      } catch {
        // silent fail
      }
      setRemoving(false);
    },
    [item.phone.id, removing]
  );

  const subtotal = item.phone.price * quantity;

  return (
    <div className="group relative rounded-2xl border border-border-subtle bg-bg-card p-4 transition-all hover:border-border-glow">
      <div className="flex gap-4">
        {/* Image */}
        <Link
          href={`/phone/${item.phone.id}`}
          className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary"
        >
          <Image
            src={item.phone.image}
            alt={item.phone.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            sizes="128px"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/phone/${item.phone.id}`}
              className="font-semibold text-text-primary hover:text-accent-sky transition-colors"
            >
              {item.phone.name}
            </Link>
            <p className="mt-1 text-sm text-text-tertiary">
              單價 NT${item.phone.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* Quantity controls */}
            <div className="flex items-center rounded-lg border border-border-subtle bg-bg-secondary">
              <button
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center text-sm font-semibold text-text-primary">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= 99}
                className="flex h-8 w-8 items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Subtotal */}
              <span className="font-semibold text-text-primary min-w-[80px] text-right">
                NT${subtotal.toLocaleString()}
              </span>

              {/* Remove button */}
              <button
                onClick={remove}
                disabled={removing}
                className="rounded-lg p-2 text-text-tertiary transition-all hover:bg-accent-rose/10 hover:text-accent-rose disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
