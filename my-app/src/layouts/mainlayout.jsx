import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import BrandLogo from "../components/brandlogo";

const currentYear = new Date().getFullYear();

export default function MainLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return (
    <div className="gallery-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Section */}
      <main className="gallery-main" id="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="gallery-footer">
        <Link to="/" aria-label="art-ana home">
          <BrandLogo inverse />
        </Link>
        <p>© {currentYear} art-ana. A space for art. / React prototype</p>
      </footer>
    </div>
  );
}
