import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFavorites } from "@/db/queries";
import PhoneCard from "@/components/PhoneCard";
import Link from "next/link";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const favorites = await getFavorites(session.user.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          我的收藏
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          共 {favorites.length} 款手機
        </p>
      </section>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((phone, i) => (
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
          <div className="text-center">
            <p className="text-4xl mb-4">
              <svg className="h-12 w-12 mx-auto text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </p>
            <p className="text-text-secondary mb-4">還沒有收藏任何手機</p>
            <Link
              href="/"
              className="text-sm text-accent-sky hover:underline"
            >
              瀏覽手機清單
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
