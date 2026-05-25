import { getPhoneById } from "@/data/phones";
import Image from "next/image";
import Link from "next/link";

const platformColors: Record<string, string> = {
  YouTube: "bg-red-500/20 text-red-400",
  Facebook: "bg-blue-500/20 text-blue-400",
  Instagram: "bg-pink-500/20 text-pink-400",
  TikTok: "bg-gray-500/20 text-gray-300",
};

export default async function PhoneDetailPage({ params }: { params: Promise<{ phoneId: string }> }) {
  const { phoneId } = await params;
  const phone = getPhoneById(phoneId);

  if (!phone) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-text-secondary">找不到該手機</p>
          <Link href="/" className="mt-4 inline-block text-sm text-accent-sky hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const discount = phone.msrp > 0 ? Math.round(((phone.msrp - phone.price) / phone.msrp) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary animate-fade-in">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          首頁
        </Link>
        <span>/</span>
        <Link
          href={`/brand/${phone.brand}`}
          className="hover:text-text-secondary transition-colors capitalize"
        >
          {phone.brand}
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{phone.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: Images */}
        <section className="space-y-4 animate-slide-up">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary">
            <Image
              src={phone.image}
              alt={phone.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {phone.ranking && (
              <div className="absolute left-4 top-4 rounded-lg bg-bg-primary/80 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-accent-amber"># {phone.ranking} 熱門</span>
              </div>
            )}
          </div>
          {phone.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {phone.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary"
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Details */}
        <section className="space-y-8">
          {/* Name & Price */}
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {phone.name}
            </h1>

            <div className="mt-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-display text-accent-sky">
                  NT${phone.price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="rounded-md bg-accent-emerald/20 px-2 py-0.5 text-sm font-semibold text-accent-emerald">
                    省 {discount}%
                  </span>
                )}
              </div>
              {phone.msrp > phone.price && (
                <p className="text-sm text-text-tertiary line-through">
                  官方建議售價 NT${phone.msrp.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Specs */}
          <div
            className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-4 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="font-display text-lg font-semibold text-text-primary">規格參數</h2>
            <div className="space-y-3">
              <SpecRow label="尺寸" value={phone.specs.dimensions} />
              <SpecRow label="重量" value={phone.specs.weight} />
              <SpecRow label="螢幕" value={phone.specs.display} />
              <SpecRow label="解析度" value={phone.specs.resolution} />
              <SpecRow label="處理器" value={phone.specs.processor} />
              <SpecRow label="GPU" value={phone.specs.gpu} />
              <SpecRow label="記憶體" value={phone.specs.ram} />
              <SpecRow label="儲存空間" value={phone.specs.storage} />
              <SpecRow label="後相機" value={phone.specs.rearCamera} />
              <SpecRow label="前相機" value={phone.specs.frontCamera} />
              <SpecRow label="電池" value={phone.specs.battery} />
              <SpecRow label="作業系統" value={phone.specs.os} />
              <SpecRow label="連線" value={phone.specs.connectivity} />
            </div>
          </div>

          {/* Reviews */}
          {phone.reviewLinks.length > 0 && (
            <div
              className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-4 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <h2 className="font-display text-lg font-semibold text-text-primary">
                社群評測
              </h2>
              <div className="space-y-3">
                {phone.reviewLinks.map((review, i) => (
                  <a
                    key={i}
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-secondary p-3 transition-all hover:border-border-glow hover:bg-bg-card-hover group"
                  >
                    <span
                      className={`flex-shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                        platformColors[review.platform] || "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {review.platform}
                    </span>
                    <span className="flex-1 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {review.title}
                    </span>
                    <svg
                      className="h-4 w-4 text-text-tertiary group-hover:text-accent-sky transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-border-subtle py-2.5 last:border-0">
      <dt className="flex-shrink-0 w-24 text-sm text-text-secondary">{label}</dt>
      <dd className="flex-1 text-sm text-text-primary">{value}</dd>
    </div>
  );
}
