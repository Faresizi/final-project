import { useState } from "react";

export default function Settings() {
  const [brand, setBrand] = useState("#6ea8fe");
  const [store, setStore] = useState("Krusty Krab");

  function handleSave() {
    // demo: save locally; connect to your backend later if you add a settings endpoint
    localStorage.setItem("brandColor", brand);
    localStorage.setItem("storeName", store);
    alert("Saved locally!");
  }

  return (
    <section className="card">
      <div className="card-header"><div className="card-title">Settings</div></div>
      <div className="card-body">
        <div className="row">
          <div>
            <label className="label">Brand Color</label>
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div>
            <label className="label">Store Name</label>
            <input className="input" value={store} onChange={(e) => setStore(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary mt-24" onClick={handleSave}>Save</button>
      </div>
    </section>
  );
}
