import { useShop } from "../../context/shop";
import { paintings } from "../../data/paintings";
import { formatPrice } from "../../lib/shop";

export default function AdminDashboard() {
  const { orders, reviews } = useShop();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demo dashboard</h1>
      <p className="field-hint mb-6">
        Statistics are from this browser only. There is no authentication or
        database management.
      </p>
      <div className="admin-stats">
        <div className="admin-card">
          <p>Catalog artworks</p>
          <strong>{paintings.length}</strong>
        </div>
        <div className="admin-card">
          <p>Demo orders</p>
          <strong>{orders.length}</strong>
        </div>
        <div className="admin-card">
          <p>Local reviews</p>
          <strong>{reviews.length}</strong>
        </div>
      </div>
      <section className="admin-card mt-6">
        <h2 className="text-lg mb-4">Recent demo orders</h2>
        {orders.length ? (
          orders.map((order) => (
            <div key={order.id} className="receipt-total">
              <span>{order.id}</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          ))
        ) : (
          <p className="field-hint">No orders in this browser yet.</p>
        )}
      </section>
    </div>
  );
}
