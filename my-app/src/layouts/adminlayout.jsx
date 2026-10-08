import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Moon, Sun, ArrowUpRight, LogOut } from "lucide-react";
import Sidebar from "../components/sidebar";
import { useShop } from "../context/shop";
import BrandLogo from "../components/brandlogo";

export default function AdminLayout() {
  const { isAdmin, logoutAdmin, theme, toggleTheme } = useShop();
  const location = useLocation();
  if (!isAdmin)
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  return (
    <div className="studio-shell">
      <a className="skip-link" href="#admin-main">
        Skip to content
      </a>
      <header className="studio-header">
        <Link
          to="/admin"
          className="gallery-brand"
          aria-label="art-ana admin home"
        >
          <BrandLogo />
          <span className="studio-label">STUDIO</span>
        </Link>
        <div className="studio-header-actions">
          <Link className="inline-link studio-gallery-link" to="/">
            View gallery <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="secondary-button" onClick={logoutAdmin}>
            <LogOut size={15} /> <span>Sign out</span>
          </button>
        </div>
      </header>
      <div className="studio-workspace">
        <Sidebar />
        <main className="studio-main" id="admin-main">
          <Outlet />
        </main>
      </div>
      <footer className="studio-footer">
        <BrandLogo />
        <span>Admin studio · art-ana</span>
        <Link to="/">
          Back to gallery <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
