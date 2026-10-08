import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Moon, ShoppingBag, Sun } from "lucide-react";
import { useShop } from "../context/shop";
import BrandLogo from "./brandlogo";

export default function Navbar() {
  const { theme, toggleTheme, cartCount } = useShop();
  return (
    <nav className="gallery-navbar" aria-label="Main navigation">
      <Link to="/" className="gallery-brand" aria-label="art-ana home">
        <BrandLogo />
      </Link>
      <div className="gallery-nav-links">
        <NavLink to="/" end>
          Gallery
        </NavLink>
        <NavLink
          to="/cart"
          className="nav-cart"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
        >
          <ShoppingBag size={17} aria-hidden="true" />
          <span className="cart-nav-text">Cart</span>
          <span className="cart-badge">{cartCount}</span>
        </NavLink>
        <NavLink to="/checkout" className="nav-checkout">
          Checkout
          <ArrowUpRight size={15} aria-hidden="true" />
        </NavLink>
        <button
          className="icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon size={18} aria-hidden="true" />
          ) : (
            <Sun size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </nav>
  );
}
