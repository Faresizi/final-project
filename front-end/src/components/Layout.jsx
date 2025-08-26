import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const navClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className="app">
      <aside className="sidebar">
        <nav className="nav">
          <div className="logo">🍔 Krusty Admin</div>
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          <NavLink to="/menu" className={navClass}>Menu</NavLink>
          <NavLink to="/orders" className={navClass}>Orders</NavLink>
          <NavLink to="/employees" className={navClass}>Employees</NavLink>
          <NavLink to="/settings" className={navClass}>Settings</NavLink>
        </nav>
      </aside>

      <header className="topbar"><div className="h2">Dashboard</div></header>
      <main className="main"><Outlet /></main>
    </div>
  );
}
