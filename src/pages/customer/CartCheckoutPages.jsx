import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { money } from "../../constants/app";
import ImportantNotes from "../../components/common/ImportantNotes";
import { supabase } from "../../lib/supabase";
export function CartPage() {
  const { items, setQuantity, subtotalCents } = useCart();
  const minimum = 5000,
    remaining = Math.max(0, minimum - subtotalCents);
  return (
    <main className="container-ui py-8">
      <h1 className="section-title">Your basket</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.length ? (
            items.map((x) => (
              <div className="card flex items-center gap-4 p-4" key={x.id}>
                <div className="flex-1">
                  <strong>
                    {x.name} · {x.variant_name}
                  </strong>
                  <p className="text-sm text-stone-500">
                    {x.pieces_per_pack} pieces per pack
                  </p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setQuantity(x.id, x.quantity - 1)}
                >
                  -
                </button>
                <strong>{x.quantity}</strong>
                <button
                  className="btn-secondary"
                  onClick={() => setQuantity(x.id, x.quantity + 1)}
                >
                  +
                </button>
                <strong className="w-20 text-right">
                  {money(x.price_cents * x.pieces_per_pack * x.quantity)}
                </strong>
              </div>
            ))
          ) : (
            <div className="card p-8 text-center">
              Your basket is empty.{" "}
              <Link className="text-brand" to="/menu">
                Browse menu
              </Link>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{money(subtotalCents)}</strong>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                style={{
                  width: `${Math.min(100, (subtotalCents / minimum) * 100)}%`,
                }}
                className="h-full bg-emerald-600"
              />
            </div>
            <p
              className={`mt-2 text-sm ${remaining ? "text-amber-700" : "text-emerald-700"}`}
            >
              {remaining
                ? `Add ${money(remaining)} more to reach the $50 minimum order amount for delivery.`
                : "You have reached the minimum amount required for delivery."}
            </p>
            <Link
              className={`btn-primary mt-5 w-full ${remaining || !items.length ? "pointer-events-none opacity-50" : ""}`}
              to="/checkout"
            >
              Proceed to checkout
            </Link>
          </div>
          <ImportantNotes minimumCents={minimum} compact />
        </aside>
      </div>
    </main>
  );
}
export function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const [addressId, setAddressId] = useState(""),
    [addresses, setAddresses] = useState([]),
    [phone, setPhone] = useState(""),
    [instructions, setInstructions] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    nav = useNavigate();
  useEffect(() => {
    supabase
      .from("delivery_addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        setAddresses(data || []);
        setAddressId(data?.[0]?.id || "");
      });
  }, []);
  async function place() {
    setBusy(true);
    setError("");
    const key = crypto.randomUUID();
    const { data, error } = await supabase.rpc("place_order", {
      p_address_id: addressId,
      p_phone: phone,
      p_instructions: instructions,
      p_items: items.map((x) => ({ product_id: x.id, quantity: x.quantity })),
      p_idempotency_key: key,
    });
    setBusy(false);
    if (error)
      setError(
        error.message.includes("minimum")
          ? "The subtotal does not meet the delivery minimum."
          : "The order could not be placed. Review the basket and try again.",
      );
    else {
      clear();
      nav(`/order-success/${data}`);
    }
  }
  return (
    <main className="container-ui max-w-3xl py-8">
      <h1 className="section-title">Checkout</h1>
      <div className="mt-6 space-y-5">
        <div className="card p-5">
          <label className="label">
            Delivery address
            <select
              className="input"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              required
            >
              <option value="">Select an address</option>
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}: {a.line1}, {a.postal_code}
                </option>
              ))}
            </select>
          </label>
          <Link to="/profile" className="mt-2 inline-block text-sm text-brand">
            Manage addresses
          </Link>
          <label className="label mt-4">
            Contact phone
            <input
              type="tel"
              className="input mt-1"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="label mt-4">
            Delivery instructions
            <input
              className="input mt-1"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </label>
        </div>
        <div className="card p-5">
          <h2 className="font-black">Payment method</h2>
          <label className="mt-3 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <input type="radio" checked readOnly />
            <span>
              <strong>Cash on Delivery</strong>
              <small className="block text-stone-600">
                Payment will be collected at delivery.
              </small>
            </span>
          </label>
        </div>
        <ImportantNotes />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          disabled={
            busy ||
            subtotalCents < 5000 ||
            !addressId ||
            !phone ||
            !items.length
          }
          onClick={place}
          className="btn-primary w-full"
        >
          {busy ? "Placing order…" : `Place order · ${money(subtotalCents)}`}
        </button>
      </div>
    </main>
  );
}
export function SuccessPage() {
  return (
    <main className="container-ui py-16 text-center">
      <div className="card mx-auto max-w-xl p-8">
        <h1 className="text-3xl font-black text-emerald-700">Order placed</h1>
        <p className="mt-3">
          Your order has been placed successfully. Payment will be collected by
          Cash on Delivery.
        </p>
        <ImportantNotes compact />
        <Link to="/my-orders" className="btn-primary mt-6">
          View my orders
        </Link>
      </div>
    </main>
  );
}
