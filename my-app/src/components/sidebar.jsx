import { NavLink } from "react-router-dom";
import {
  Frame,
  Info,
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/artworks", label: "Artworks", icon: Frame },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/about", label: "About", icon: Info },
];
export default function Sidebar() {
  return (
    <aside className="studio-sidebar">
      <p className="section-eyebrow">YOUR WORKSPACE</p>
      <nav aria-label="Admin navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="studio-sidebar-note">
        <span className="tiny-label">MADE FOR LEARNING</span>
        <p>
          Curate the collection.
          <br />
          Keep the stories alive.
        </p>
        <small>Changes are saved in this browser only.</small>
      </div>
    </aside>
  );
}
