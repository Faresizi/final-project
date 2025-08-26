import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🍔 Krusty Menu</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p style={{ color: "red" }}>Failed to load products.</p>}

      <ul>
        {items.map((p) => (
          <li key={p._id}>
            <strong>{p.name}</strong> — ${p.price} <br />
            <em>{p.description}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
