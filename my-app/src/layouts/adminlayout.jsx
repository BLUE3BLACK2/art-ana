import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useShop } from "../context/shop";
import BrandLogo from "../components/brandlogo";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useShop();

  return (
    <div className="admin-shell flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar for mobile */}
        <div className="admin-bar p-4 flex flex-wrap items-center gap-3 justify-between border-b">
          <h1 className="font-bold flex flex-wrap items-center gap-3">
            <BrandLogo />
            <span>Local demo</span>
          </h1>
          <div className="flex gap-3">
            <button
              className="md:hidden icon-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open admin menu"
              aria-expanded={sidebarOpen}
            >
              <Menu size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon size={18} aria-hidden="true" />
              ) : (
                <Sun size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="admin-bar border-t p-4 text-center text-sm flex flex-wrap items-center justify-center gap-4">
          <BrandLogo />
          <span>Demo panel, not a production admin</span>
        </footer>
      </div>
    </div>
  );
}
