import { useEffect, useState } from "react";
import { getMenu, createMenuItem } from "../api";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await getMenu();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      alert("Failed to load menu: " + e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.price = Number(payload.price);
    try {
      await createMenuItem(payload);
      e.currentTarget.reset();
      await load();
    } catch (e) {
      alert("Create failed: " + e.message);
    }
  }

  return (
    <>
      <section className="card">
        <div className="card-header"><div className="card-title">Add New Product</div></div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="row">
              <div>
                <label className="label">Name</label>
                <input className="input" name="name" placeholder="Krabby Patty" required />
              </div>
              <div>
                <label className="label">Price</label>
                <input className="input" name="price" type="number" step="0.01" placeholder="3.50" required />
              </div>
            </div>

            <div className="row mt-16">
              <div>
                <label className="label">Category</label>
                <select className="select" name="category" defaultValue="Burger">
                  <option>Burger</option><option>Drink</option><option>Side</option><option>Dessert</option>
                </select>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input className="input" name="image" placeholder="https://..." />
              </div>
            </div>

            <div className="mt-16">
              <label className="label">Description</label>
              <textarea className="textarea" name="description" rows="3" placeholder="Classic with secret sauce"></textarea>
            </div>

            <div className="flex space-between mt-24">
              <button type="reset" className="btn btn-ghost">Reset</button>
              <button className="btn btn-primary">Create Product</button>
            </div>
          </form>
        </div>
      </section>

      <section className="card mt-24">
        <div className="card-header"><div className="card-title">Menu Items</div></div>
        <div className="card-body">
          {loading ? <div className="p">Loading…</div> : (
            <table className="table">
              <thead><tr><th>Name</th><th>Category</th><th>Price</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id || it.id || it.name}>
                    <td>{it.name}</td>
                    <td>{it.category}</td>
                    <td>{typeof it.price === "number" ? `$${it.price.toFixed(2)}` : it.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
