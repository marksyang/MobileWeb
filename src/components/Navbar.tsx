import Link from "next/link";
import Image from "next/image";
import { getAllBrands, getCartCount } from "@/db/queries";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const brands = await getAllBrands();
  const session = await auth();
  const cartCount = session?.user?.id ? await getCartCount(session.user.id) : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold font-display tracking-tight text-text-primary transition-colors hover:text-accent-sky"
        >
          <span className="bg-gradient-to-r from-accent-sky to-accent-violet bg-clip-text text-transparent">
            MobileWeb
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.id}`}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-card-hover hover:text-text-primary whitespace-nowrap"
            >
              <span>{brand.logo}</span>
              <span className="hidden sm:inline">{brand.name}</span>
            </Link>
          ))}
        </nav>

        {/* Cart icon with badge */}
        <Link
          href={session ? "/cart" : "/login"}
          className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-card-hover hover:text-text-primary"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-sky text-[10px] font-bold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {session ? (
          <UserMenu
            name={session.user?.name ?? "User"}
            email={session.user?.email ?? ""}
            image={session.user?.image ?? ""}
          />
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-card-hover hover:text-text-primary"
          >
            登入
          </Link>
        )}
      </div>
    </header>
  );
}
