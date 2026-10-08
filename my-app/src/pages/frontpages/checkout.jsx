import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CircleCheck,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useShop } from "../../context/shop";
import { formatPrice, sizeLabel } from "../../lib/shop";
import OrderSummary from "../../components/ordersummary";

function Confirmation({ order }) {
  return (
    <section className="confirmation">
      <span className="confirmation-icon">
        <CircleCheck size={38} aria-hidden="true" />
      </span>
      <p className="section-eyebrow">DEMO ORDER CONFIRMED</p>
      <h1>
        Your selected artworks
        <br />
        have been reserved.
      </h1>
      <p>
        No payment has been taken and no items will be shipped.
        <br />
        Thank you for exploring art-ana.
      </p>
      <div className="confirmation-receipt">
        <div className="receipt-heading">
          <span>{order.id}</span>
          <time dateTime={order.date}>
            {new Date(order.date).toLocaleDateString("en-GB")}
          </time>
        </div>
        {order.items.map((item) => {
          return (
            <div className="receipt-item" key={`${item.id}-${item.size}`}>
              {item.image && <img src={item.image} alt={item.title} />}
              <div>
                <strong>{item.title}</strong>
                <span>
                  {sizeLabel(item.size)} · {item.quantity}{" "}
                  {item.quantity === 1 ? "print" : "prints"}
                </span>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          );
        })}
        <div className="receipt-total">
          <span>Shipping</span>
          <span>{order.shipping ? formatPrice(order.shipping) : "Free"}</span>
        </div>
        <div className="receipt-total">
          <strong>Demo total</strong>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>
      <p className="field-hint">
        This summary is saved in your browser. Your name, email, and address are
        not stored.
      </p>
      <Link className="gallery-button" to="/#koleksi">
        Back to collection
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

export default function Checkout() {
  const { cartItems, orders, placeOrder } = useShop();
  const [params, setParams] = useSearchParams();
  const [payment, setPayment] = useState("transfer");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const order = orders.find((entry) => entry.id === params.get("order"));

  function handleCheckout(event) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    if (
      ["name", "email", "address", "city", "postal"].some(
        (key) => !String(data.get(key) || "").trim(),
      )
    ) {
      setError("Please complete the delivery details first.");
      return;
    }
    submitting.current = true;
    const result = placeOrder();
    if (result) {
      setParams({ order: result.id }, { replace: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      setError(
        "Could not create your order. Please check the stock and your cart.",
      );
      submitting.current = false;
    }
  }

  if (order)
    return (
      <div className="page-content">
        <Confirmation order={order} />
      </div>
    );
  if (!cartItems.length)
    return (
      <div className="page-content empty-state">
        <ShoppingBag size={40} aria-hidden="true" />
        <h1>Your cart is still empty.</h1>
        <p>Choose at least one artwork before checking out.</p>
        <Link className="gallery-button" to="/#koleksi">
          Discover art
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );

  return (
    <div className="page-content">
      <Link className="back-link" to="/cart">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to cart
      </Link>
      <div className="page-heading">
        <p className="section-eyebrow">THE FINISHING TOUCH</p>
        <h1>Checkout.</h1>
        <p>Complete a demo order for your selected artworks.</p>
      </div>
      <div className="checkout-notice">
        <PackageCheck size={18} aria-hidden="true" />
        <p>
          This is a demo checkout. Use sample details, not real personal
          information.
        </p>
      </div>
      <form className="shopping-grid" onSubmit={handleCheckout}>
        <div className="checkout-form">
          <section>
            <h2>
              <MapPin size={19} aria-hidden="true" />
              Delivery details
            </h2>
            <div className="form-grid">
              <label className="field">
                <span>Recipient name</span>
                <input
                  name="name"
                  autoComplete="off"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Example: Gallery Visitor"
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  maxLength={100}
                  placeholder="example@example.com"
                />
              </label>
              <label className="field span-two">
                <span>Full address</span>
                <textarea
                  name="address"
                  autoComplete="off"
                  required
                  minLength={5}
                  maxLength={300}
                  rows={3}
                  placeholder="Use a sample address for this demo"
                />
              </label>
              <label className="field">
                <span>City / region</span>
                <input
                  name="city"
                  autoComplete="off"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Example: Denpasar"
                />
              </label>
              <label className="field">
                <span>Postal code</span>
                <input
                  name="postal"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  title="Enter a 5-digit postal code"
                  autoComplete="off"
                  required
                  maxLength={5}
                  placeholder="80111"
                />
              </label>
            </div>
          </section>
          <section className="payment-section">
            <h2>
              <Banknote size={19} aria-hidden="true" />
              Demo payment method
            </h2>
            <fieldset className="payment-options">
              <legend className="sr-only">Choose a demo payment method</legend>
              {[
                {
                  value: "transfer",
                  title: "Bank transfer",
                  description: "Do not make an actual transfer.",
                },
                {
                  value: "cod",
                  title: "Cash on delivery",
                  description: "There is no actual delivery or charge.",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={payment === option.value ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={payment === option.value}
                    onChange={() => setPayment(option.value)}
                  />
                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>
          <section className="checkout-items">
            <h2>Your selected artworks</h2>
            {cartItems.map((item) => (
              <div key={item.key}>
                <span>
                  {item.painting.title}
                  <small>
                    {sizeLabel(item.size)} · {item.quantity}{" "}
                    {item.quantity === 1 ? "print" : "prints"}
                  </small>
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </section>
        </div>
        <OrderSummary>
          <label className="consent">
            <input type="checkbox" required />
            <span>
              I understand this is a demo, with no real transaction or delivery.
            </span>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="gallery-button full-width" type="submit">
            Place demo order
            <Check size={16} aria-hidden="true" />
          </button>
        </OrderSummary>
      </form>
    </div>
  );
}
