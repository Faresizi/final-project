import { useEffect, useState } from "react";
import { getMenu, getOrders, getEmployees } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ items: 0, orders: 0, employees: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [menu, orders, employees] = await Promise.all([getMenu(), getOrders(), getEmployees()]);
        const itemsArr = Array.isArray(menu) ? menu : menu.items || [];
        const ordersArr = Array.isArray(orders) ? orders : orders.orders || [];
        const employeesArr = Array.isArray(employees) ? employees : employees.employees || [];

        // Try to compute revenue robustly
        const revenue = ordersArr.reduce((sum, o) => {
          if (typeof o.total === "number") return sum + o.total;
          if (Array.isArray(o.items)) {
            const sub = o.items.reduce((s, it) => {
              const q = Number(it.quantity || 1);
              // support either nested price or flat price
              const p = Number(it.price ?? it.menuItem?.price ?? 0);
              return s + q * p;
            }, 0);
            return sum + sub;
          }
          return sum;
        }, 0);

        setStats({
          items: itemsArr.length,
          orders: ordersArr.length,
          employees: employeesArr.length,
          revenue,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h1 className="h1">Dashboard</h1>
      <p className="p">Quick overview of your store.</p>

      <div className="grid grid-3 mt-24">
        <Card title="Revenue" value={loading ? "…" : `$${stats.revenue.toFixed(2)}`} />
        <Card title="Orders" value={loading ? "…" : stats.orders} />
        <Card title="Menu Items" value={loading ? "…" : stats.items} />
      </div>

      <div className="grid grid-3 mt-24">
        <Card title="Employees" value={loading ? "…" : stats.employees} />
        <div className="card"><div className="card-header"><div className="card-title">Status</div></div><div className="card-body"><span className="badge success">All systems normal</span></div></div>
        <div className="card"><div className="card-header"><div className="card-title">Tips</div></div><div className="card-body"><p className="p">Use the Menu page to add products directly from the dashboard.</p></div></div>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">{title}</div></div>
      <div className="card-body"><div className="h1">{value}</div></div>
    </div>
  );
}
