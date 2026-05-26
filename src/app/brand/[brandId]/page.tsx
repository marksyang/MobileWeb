import { getPhonesByBrand, getBrandById } from "@/db/queries";
import PhoneCard from "@/components/PhoneCard";
import Link from "next/link";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  const brand = await getBrandById(brandId);
  const phones = await getPhonesByBrand(brandId);

  if (!brand) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-text-secondary">找不到該品牌</p>
          <Link href="/" className="mt-4 inline-block text-sm text-accent-sky hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Brand Header */}
      <section className="mb-12 animate-fade-in">
        <div className="mb-4 text-4xl">{brand.logo}</div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {brand.name} 全系列手機
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          共 {phones.length} 款手機
        </p>
      </section>

      {/* Phone Grid */}
      {phones.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {phones
            .sort((a, b) => (a.ranking ?? 99) - (b.ranking ?? 99))
            .map((phone, i) => (
              <div
                key={phone.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <PhoneCard phone={phone} />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-text-secondary">目前暫無該品牌手機資料</p>
        </div>
      )}
    </div>
  );
}
