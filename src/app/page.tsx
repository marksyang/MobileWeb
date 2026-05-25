import { getTopPhones } from "@/data/phones";
import PhoneCard from "@/components/PhoneCard";

export default function Home() {
  const topPhones = getTopPhones();

  return (
    <div className="relative">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent-sky/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-accent-violet/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card px-4 py-1.5 text-xs text-text-secondary mb-6">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
            2026 年 5 月排行榜
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent">
              本月最熱門
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-sky to-accent-violet bg-clip-text text-transparent">
              手機排行榜
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
            為您精選台灣市場最受歡迎的手機，從旗艦到平價，一網打盡所有規格與價格比較
          </p>
        </section>

        {/* Top 20 Grid */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center gap-1 text-accent-amber">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold">TOP 20</span>
            </div>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {topPhones.map((phone, i) => (
              <div
                key={phone.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <PhoneCard phone={phone} rank={phone.ranking} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
