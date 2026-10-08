import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../../context/shop";
import { formatPrice, sizeLabel } from "../../lib/shop";
import QuantityControl from "../../components/quantitycontrol";
import OrderSummary from "../../components/ordersummary";

export default function Cart() {
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    stockFor,
    inCart,
  } = useShop();
  return (
    <div className="page-content">
      <Link className="back-link" to="/#koleksi">
        <ArrowLeft size={16} aria-hidden="true" />
        Continue exploring
      </Link>
      <div className="page-heading">
        <p className="section-eyebrow">ONE STEP CLOSER</p>
        <h1>
          Your cart<span className="heading-count">{cartCount}</span>
        </h1>
        <p>Art you have chosen to make your space your own.</p>
      </div>
      {cartItems.length ? (
        <div className="shopping-grid">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.key}>
                <Link className="cart-image" to={`/product/${item.id}`}>
                  <img src={item.painting.image} alt={item.painting.title} />
                </Link>
                <div className="cart-item-info">
                  <p className="tiny-label">{item.painting.subject}</p>
                  <h2>
                    <Link to={`/product/${item.id}`}>
                      {item.painting.title}
                    </Link>
                  </h2>
                  <p>{item.painting.artist}</p>
                  <p className="cart-size">
                    Print {sizeLabel(item.size)} · unframed
                  </p>
                  <p className="unit-price">
                    {formatPrice(item.price)} / print
                  </p>
                  <div className="cart-item-actions">
                    <QuantityControl
                      value={item.quantity}
                      max={stockFor(item.id) - inCart(item.id) + item.quantity}
                      onChange={(quantity) =>
                        updateQuantity(item.key, quantity)
                      }
                      label={`${item.painting.title} ${sizeLabel(item.size)}`}
                    />
                    <button
                      className="text-button remove-button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Remove ${item.painting.title} ${sizeLabel(item.size)}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <strong className="line-total">
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </article>
            ))}
          </div>
          <OrderSummary>
            <Link className="gallery-button full-width" to="/checkout">
              Proceed to checkout
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </OrderSummary>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={40} aria-hidden="true" />
          <h2>There is still room for art.</h2>
          <p>Your cart is empty. Find a piece you would love to bring home.</p>
          <Link className="gallery-button" to="/#koleksi">
            Explore the collection
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
