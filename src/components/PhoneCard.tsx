import Link from "next/link";
import type { Phone } from "@/lib/types";
import Image from "next/image";

export default function PhoneCard({ phone, rank }: { phone: Phone; rank?: number }) {
  const discount = phone.msrp > 0 ? Math.round(((phone.msrp - phone.price) / phone.msrp) * 100) : 0;

  return (
    <Link href={`/phone/${phone.id}`}>
      <div className="group relative rounded-2xl border border-border-subtle bg-bg-card p-4 transition-all duration-300 hover:border-border-glow hover:bg-bg-card-hover hover:shadow-lg hover:shadow-accent-sky/5">
        {/* Rank Badge */}
        {rank && (
          <div className="absolute -left-1 -top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-sky to-accent-violet text-xs font-bold font-display shadow-lg shadow-accent-sky/20">
            {rank}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute right-3 top-3 rounded-md bg-accent-rose/20 px-2 py-0.5 text-xs font-semibold text-accent-rose">
            -{discount}%
          </div>
        )}

        {/* Image */}
        <div className="relative mb-4 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-bg-secondary">
          <Image
            src={phone.image}
            alt={phone.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw (max-width: 1024px) 50vw 25vw"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="truncate text-sm font-semibold text-text-primary group-hover:text-accent-sky transition-colors">
            {phone.name}
          </h3>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-display text-text-primary">
                NT${phone.price.toLocaleString()}
              </span>
            </div>
            {phone.msrp > phone.price && (
              <span className="block text-xs text-text-tertiary line-through">
                建議售價 NT${phone.msrp.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
