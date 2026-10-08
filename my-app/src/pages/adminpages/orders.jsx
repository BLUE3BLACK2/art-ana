import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useShop } from "../../context/shop";
import { orderStatuses } from "../../lib/admin";
import { formatPrice, sizeLabel } from "../../lib/shop";

export default function AdminOrders() {
  const { orders, changeOrderStatus } = useShop();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const filtered = orders.filter(
    (order) =>
      (!status || (order.status || "Pending") === status) &&
      `${order.id} ${order.items.map((item) => item.title).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="section-eyebrow">FROM THE GALLERY TO THEIR WALLS</p>
          <h1>Every order, a story.</h1>
          <p className="admin-muted">
            Review the details and keep your orders up to date.
          </p>
        </div>
      </div>
      <div className="studio-toolbar">
        <label className="search-field">
          <Search size={17} />
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or artwork…"
          />
        </label>
        <label className="field">
          <span className="sr-only">Filter order status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {orderStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="studio-local-note">
        Cancellation does not automatically restock; adjust available stock in
        Artworks if needed.
      </p>
      <div className="studio-order-list">
        {filtered.length ? (
          filtered.map((order) => (
            <article className="studio-card" key={order.id}>
              <div className="studio-section-heading">
                <div>
                  <h2>{order.id}</h2>
                  <time className="admin-muted" dateTime={order.date}>
                    {new Date(order.date).toLocaleString("en-GB")}
                  </time>
                </div>
                <label className="field">
                  <span className="sr-only">Status for {order.id}</span>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      changeOrderStatus(order.id, e.target.value)
                    }
                  >
                    {orderStatuses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              {order.items.map((item) => (
                <div
                  className="studio-order-item"
                  key={`${item.id}-${item.size}`}
                >
                  {item.image && <img src={item.image} alt={item.title} />}
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {sizeLabel(item.size)} · Quantity {item.quantity}
                    </span>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="receipt-total">
                <span>Shipping</span>
                <span>
                  {order.shipping ? formatPrice(order.shipping) : "Free"}
                </span>
              </div>
              <div className="receipt-total">
                <strong>Total</strong>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </article>
          ))
        ) : (
          <div className="studio-card studio-empty">
            <ShoppingBag size={28} />
            <h2>No orders here yet.</h2>
            <p>Orders will appear here. Try another filter if needed.</p>
          </div>
        )}
      </div>
    </>
  );
}
