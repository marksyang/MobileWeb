import Link from "next/link";
import Image from "next/image";
import { getAllBrands } from "@/db/queries";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const brands = await getAllBrands();
  const session = await auth();

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
