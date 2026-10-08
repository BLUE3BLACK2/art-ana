import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Frame,
  MessageSquare,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useShop } from "../../context/shop";
import { formatPrice } from "../../lib/shop";
export default function AdminDashboard() {
  const { paintings, orders, reviews, stockFor } = useShop();
  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: "Artworks in collection", value: paintings.length, icon: Frame },
    { label: "Orders", value: orders.length, icon: ShoppingBag },
    { label: "Visitor reviews", value: reviews.length, icon: MessageSquare },
    { label: "Order value", value: formatPrice(revenue), icon: Wallet },
  ];
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="section-eyebrow">BEHIND THE COLLECTION</p>
          <h1>A fresh perspective.</h1>
          <p className="admin-muted">
            A little overview of your gallery, all in one place.
          </p>
        </div>
        <Link to="/admin/artworks" className="gallery-button">
          Manage collection <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="studio-stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="studio-stat" key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="studio-overview-grid">
        <section className="studio-card">
          <div className="studio-section-heading">
            <h2>Recent orders</h2>
            <Link to="/admin/orders" className="inline-link">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {orders.length ? (
            orders.slice(0, 4).map((order) => (
              <Link
                to="/admin/orders"
                className="studio-order-preview"
                key={order.id}
              >
                <div>
                  <strong>{order.id}</strong>
                  <span>
                    {new Date(order.date).toLocaleDateString("en-GB")} ·{" "}
                    {order.status || "Pending"}
                  </span>
                </div>
                <strong>{formatPrice(order.total)}</strong>
              </Link>
            ))
          ) : (
            <div className="studio-empty">
              <ShoppingBag size={28} />
              <h3>Room for a first order.</h3>
              <p>Orders placed in this browser will appear here.</p>
              <Link className="inline-link" to="/">
                Explore the gallery <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </section>
        <section className="studio-card studio-collection-preview">
          <div className="studio-section-heading">
            <h2>In the collection</h2>
            <Frame size={18} />
          </div>
          <div className="studio-mini-artworks">
            {paintings.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to={`/admin/artworks/${p.id}`}
                aria-label={`View details for ${p.title}`}
              >
                <img src={p.image} alt={p.title} />
              </Link>
            ))}
          </div>
          <p className="admin-muted">
            {paintings.filter((p) => stockFor(p.id) === 0).length} out of stock
            · {reviews.filter((r) => r.hidden).length} hidden reviews
          </p>
          <Link to="/admin/artworks" className="secondary-button">
            Curate your artworks <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
