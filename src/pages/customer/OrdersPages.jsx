import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { money, ORDER_STEPS } from "../../constants/app";
import StatusBadge from "../../components/common/StatusBadge";
import { Spinner, EmptyState } from "../../components/common/States";
export function MyOrders() {
  const [o, setO] = useState(null);
  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 49)
      .then(({ data }) => setO(data || []));
  }, []);
  if (!o) return <Spinner />;
  return (
    <main className="container-ui py-8">
      <h1 className="section-title">My orders</h1>
      <div className="mt-5 space-y-3">
        {o.length ? (
          o.map((x) => (
            <Link
              className="card flex items-center justify-between p-4"
              key={x.id}
              to={`/my-orders/${x.id}`}
            >
              <div>
                <strong>{x.order_number}</strong>
                <p className="text-sm text-stone-500">
                  {new Date(x.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={x.order_status} />
                <p className="mt-1 font-bold">{money(x.final_total_cents)}</p>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState title="No previous orders" />
        )}
      </div>
    </main>
  );
}
export function OrderDetails() {
  const { id } = useParams(),
    [o, setO] = useState(null);
  useEffect(() => {
    supabase
      .from("orders")
      .select("*,order_items(*),order_status_history(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => setO(data));
  }, [id]);
  if (!o) return <Spinner />;
  return (
    <main className="container-ui max-w-3xl py-8">
      <h1 className="section-title">Order {o.order_number}</h1>
      <div className="card mt-5 p-5">
        <StatusBadge status={o.order_status} />
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {ORDER_STEPS.map((s, i) => {
            const done = ORDER_STEPS.indexOf(o.order_status) >= i;
            return (
              <div key={s} className="text-center">
                <div
                  className={`mx-auto grid size-9 place-items-center rounded-full font-bold ${done ? "bg-emerald-600 text-white" : "bg-stone-200"}`}
                >
                  {i + 1}
                </div>
                <p className="mt-2 text-xs font-bold">
                  {s.replaceAll("_", " ")}
                </p>
              </div>
            );
          })}
        </div>
        {o.order_status === "cancelled" && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-red-800">
            Your order has been cancelled. {o.cancellation_reason}
          </p>
        )}
        <div className="mt-6 space-y-2">
          {o.order_items.map((x) => (
            <div className="flex justify-between" key={x.id}>
              <span>
                {x.quantity} × {x.product_name_snapshot} {x.variant_snapshot}
              </span>
              <strong>{money(x.line_total_cents)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t pt-4 text-right">
          <strong>Total: {money(o.final_total_cents)}</strong>
          <p className="text-sm">
            Payment: Cash on Delivery · {o.payment_status.replaceAll("_", " ")}
          </p>
        </div>
      </div>
    </main>
  );
}
