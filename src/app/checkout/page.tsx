import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCartItems } from "@/db/queries";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cartItems = await getCartItems(session.user.id);

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.phone.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <section className="mb-10 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          結帳
        </h1>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order Summary */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              訂單內容
            </h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.phone.id}
                  className="flex items-center gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {item.phone.name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      數量: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">
                    NT${(item.phone.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border-subtle pt-3 flex justify-between">
              <span className="font-semibold text-text-primary">總計</span>
              <span className="text-xl font-bold font-display text-accent-sky">
                NT${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}
