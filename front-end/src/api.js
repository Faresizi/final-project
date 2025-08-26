// src/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const LS = { EMPLOYEES: "krusty_employees_local" };

// read token (saved by your login flow)
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch {}
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {};
  return res.json();
}

/* ---------- Endpoint auto-discovery ---------- */
const cache = { menu: null, orders: null, employees: null };

async function probe(paths) {
  for (const p of paths) {
    try {
      const r = await fetch(`${BASE}/${p}`, { headers: { ...authHeaders() } });
      if (r.ok) return p;
    } catch {}
  }
  return null;
}

async function resolve(key, candidates) {
  if (cache[key]) return cache[key];
  const found = await probe(candidates);
  cache[key] = found || candidates[0]; // default to first if not found
  if (!found) console.warn(`[api] No "${key}" endpoint detected. Defaulting to: ${cache[key]}`);
  return cache[key];
}

/* ---------- localStorage helpers (Employees fallback) ---------- */
function lsRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function lsWrite(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ---------- Public API ---------- */
// MENU
export async function getMenu() {
  const path = await resolve("menu", ["menu", "products", "recipes", "items", "menu-items"]);
  return fetchJSON(`${BASE}/${path}`);
}
export async function createMenuItem(data) {
  const path = await resolve("menu", ["menu", "products", "recipes", "items", "menu-items"]);
  return fetchJSON(`${BASE}/${path}`, { method: "POST", body: JSON.stringify(data) });
}

// ORDERS
export async function getOrders() {
  const path = await resolve("orders", ["orders", "order"]);
  return fetchJSON(`${BASE}/${path}`);
}

// EMPLOYEES (uses localStorage if API route doesn't exist)
export async function getEmployees() {
  const path = await resolve("employees", ["employees", "staff", "crew"]);
  try {
    // If path exists but 404s, this throws and we fall back to local
    return await fetchJSON(`${BASE}/${path}`);
  } catch {
    console.warn("[api] Employees API unavailable → using localStorage");
    return lsRead(LS.EMPLOYEES);
  }
}

export async function createEmployee(data) {
  const path = await resolve("employees", ["employees", "staff", "crew"]);
  try {
    return await fetchJSON(`${BASE}/${path}`, { method: "POST", body: JSON.stringify(data) });
  } catch {
    console.warn("[api] Employees POST failed → saving to localStorage");
    const rows = lsRead(LS.EMPLOYEES);
    const newRow = { _id: `local-${Date.now()}`, ...data };
    rows.push(newRow);
    lsWrite(LS.EMPLOYEES, rows);
    return newRow;
  }
}
