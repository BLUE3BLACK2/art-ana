import { Truck } from "lucide-react";
import { useShop } from "../context/shop";
import { formatPrice } from "../lib/shop";

export default function OrderSummary({ children }) {
  const { subtotal, shipping, total, cartCount } = useShop();
  return (
    <aside className="order-summary">
      <p className="section-eyebrow">YOURS, SOON.</p>
      <h2>Order summary</h2>
      <dl>
        <div>
          <dt>
            Subtotal ({cartCount} {cartCount === 1 ? "print" : "prints"})
          </dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="summary-total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className="shipping-note">
        <Truck size={16} aria-hidden="true" />
        {subtotal < 500000
          ? `Add ${formatPrice(500000 - subtotal)} for free shipping.`
          : "You qualify for free shipping."}
      </p>
      {children}
      <p className="field-hint">
        Demo checkout. No real payments or deliveries.
      </p>
    </aside>
  );
}
