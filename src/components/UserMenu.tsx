"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function UserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-bg-card-hover"
      >
        {image ? (
          <div className="h-8 w-8 overflow-hidden rounded-full border border-border-subtle">
            <Image
              src={image}
              alt={name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-bg-card-hover text-sm font-medium text-text-secondary">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border-subtle bg-bg-card p-1.5 shadow-xl animate-fade-in">
          <div className="px-3 py-2 border-b border-border-subtle mb-1.5">
            <p className="text-sm font-semibold text-text-primary truncate">
              {name}
            </p>
            <p className="text-xs text-text-tertiary truncate">{email}</p>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary"
            onClick={() => setOpen(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            個人資料
          </Link>

          <Link
            href="/favorites"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary"
            onClick={() => setOpen(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            我的收藏
          </Link>

          <div className="border-t border-border-subtle mt-1.5 pt-1.5">
            <SignOutButton className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-accent-rose transition-colors hover:bg-bg-card-hover">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              登出
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}
