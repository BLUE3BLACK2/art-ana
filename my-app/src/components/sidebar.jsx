import { Link } from "react-router-dom";
import { ArrowLeft, Info, LayoutDashboard } from "lucide-react";
import BrandLogo from "./brandlogo";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block w-64 shrink-0 border-r`}
    >
      <div className="p-4">
        <Link to="/" aria-label="art-ana home">
          <BrandLogo />
        </Link>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link
          to="/admin/dashboard"
          className="inline-link p-2 rounded"
          onClick={() => setSidebarOpen(false)}
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          Dashboard
        </Link>
        <Link
          to="/admin/about"
          className="inline-link p-2 rounded"
          onClick={() => setSidebarOpen(false)}
        >
          <Info size={16} aria-hidden="true" />
          About this prototype
        </Link>
        <Link to="/" className="inline-link p-2 rounded">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to gallery
        </Link>
      </nav>
    </aside>
  );
}
