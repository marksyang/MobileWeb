"use client";

import { useState, useCallback } from "react";

export default function FavoriteButton({
  phoneId,
  initialFavorite = false,
}: {
  phoneId: string;
  initialFavorite?: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading) return;

      setLoading(true);
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneId }),
        });
        const data = await res.json();
        if (data.favorite !== undefined) {
          setFavorited(data.favorite);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    },
    [phoneId, loading]
  );

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`group/fav flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
        favorited
          ? "border-accent-rose/30 bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20"
          : "border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-glow hover:text-text-primary"
      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <svg
        className={`h-4 w-4 transition-colors ${
          favorited ? "fill-accent-rose" : "fill-none group-hover/fav:fill-text-secondary"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {favorited ? "已收藏" : "收藏"}
    </button>
  );
}
