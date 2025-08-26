import { useEffect, useMemo, useState } from "react";
import { getOrders } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (e) {
        alert("Failed to load orders: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const summary = useMemo(() => {
    const count = orders.length;
    const total = orders.reduce((sum, o) => {
      if (typeof o.total === "number") return sum + o.total;
      if (Array.isArray(o.items)) {
        return sum + o.items.reduce((s, it) => {
          const q = Number(it.quantity || 1);
          const p = Number(it.price ?? it.menuItem?.price ?? 0);
          return s + q * p;
        }, 0);
      }
      return sum;
    }, 0);
    return { count, total };
  }, [orders]);

  return (
    <>
      <section className="grid grid-3">
        <div className="card"><div className="card-header"><div className="card-title">Orders</div></div><div className="card-body"><div className="h1">{loading ? "…" : summary.count}</div></div></div>
        <div className="card"><div className="card-header"><div className="card-title">Revenue</div></div><div className="card-body"><div className="h1">{loading ? "…" : `$${summary.total.toFixed(2)}`}</div></div></div>
        <div className="card"><div className="card-header"><div className="card-title">Status</div></div><div className="card-body"><span className="badge success">Live</span></div></div>
      </section>

      <section className="card mt-24">
        <div className="card-header"><div className="card-title">Recent Orders</div></div>
        <div className="card-body">
          {loading ? <div className="p">Loading…</div> : (
            <table className="table">
              <thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((o, i) => {
                  const itemsCount = Array.isArray(o.items) ? o.items.reduce((n, it) => n + (it.quantity || 1), 0) : (o.itemsCount ?? 0);
                  return (
                    <tr key={o._id || i}>
                      <td>{i + 1}</td>
                      <td>{o.customer?.name || o.customer || "—"}</td>
                      <td>{itemsCount}</td>
                      <td><span className="badge success">{o.status || "Placed"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
