import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCartItems, getCartCount } from "@/db/queries";
import CartItemRow from "@/components/CartItemRow";
import Link from "next/link";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cartItems = await getCartItems(session.user.id);
  const totalItems = await getCartCount(session.user.id);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.phone.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <section className="mb-10 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          購物車
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          共 {totalItems} 件商品
        </p>
      </section>

      {cartItems.length > 0 ? (
        <div className="space-y-8">
          {/* Cart items */}
          <div className="space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={item.phone.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CartItemRow item={item} initialCount={totalItems} />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-4 animate-slide-up">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              訂單摘要
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">商品總計</span>
                <span className="text-text-primary">NT${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">運費</span>
                <span className="text-accent-emerald">免運費</span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex justify-between">
                <span className="font-semibold text-text-primary">總計</span>
                <span className="text-xl font-bold font-display text-accent-sky">
                  NT${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">
              <svg className="h-12 w-12 mx-auto text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </p>
            <p className="text-text-secondary mb-4">購物車是空的</p>
            <Link
              href="/"
              className="text-sm text-accent-sky hover:underline"
            >
              開始挑選手機
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
