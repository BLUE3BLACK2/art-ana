import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { printSizes } from "../../data/printoptions";
import { useShop } from "../../context/shop";
import { formatPrice, unitPrice } from "../../lib/shop";
import QuantityControl from "../../components/quantitycontrol";
import Reviews from "../../components/reviews";
import PaintingCard from "../../components/paintingcard";
import NotFound from "./notfound";

function PaintingDetail({ painting }) {
  const [size, setSize] = useState(painting.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { paintings, addToCart, stockFor, inCart, ratingFor } = useShop();
  const stock = stockFor(painting.id);
  const available = stock - inCart(painting.id);
  const rating = ratingFor(painting.id);
  return (
    <div className="page-content">
      <Link className="back-link" to="/#koleksi">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to collection
      </Link>
      <section className="product-grid" aria-labelledby="product-title">
        <div
          className="product-art"
          style={{ "--painting-image": `url("${painting.image}")` }}
        >
          <img src={painting.image} alt={painting.title} fetchPriority="high" />
          <span className="art-caption">ART-ANA PRINT COLLECTION</span>
        </div>
        <div className="product-info">
          <p className="section-eyebrow">
            {painting.era} / {painting.origin}
          </p>
          <h1 id="product-title">{painting.title}</h1>
          <p className="product-artist">{painting.artist}</p>
          <a className="product-rating" href="#reviews-title">
            <Star
              size={15}
              fill={rating.count ? "currentColor" : "none"}
              aria-hidden="true"
            />
            {rating.count
              ? `${rating.average.toFixed(1)} · ${rating.count} reviews`
              : "No reviews yet · share your thoughts"}
          </a>
          <p className="product-price">
            {formatPrice(unitPrice(painting, size))}
          </p>
          <p className="product-description">{painting.description}</p>
          <dl className="product-facts">
            <div>
              <dt>Subject</dt>
              <dd>{painting.subject}</dd>
            </div>
            <div>
              <dt>Artist / reference origin</dt>
              <dd>{painting.origin}</dd>
            </div>
            <div>
              <dt>Product type</dt>
              <dd>Unframed art print</dd>
            </div>
            <div>
              <dt>Demo stock</dt>
              <dd>
                {stock > 0 ? `${stock} prints available` : "Out of stock"}
              </dd>
            </div>
          </dl>
          <fieldset className="size-picker">
            <legend>Print size</legend>
            <div>
              {printSizes
                .filter((option) => painting.sizes.includes(option.value))
                .map((option) => (
                  <label
                    key={option.value}
                    className={size === option.value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={option.value}
                      checked={size === option.value}
                      onChange={() => setSize(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
            </div>
          </fieldset>
          <p className="field-hint">
            These are print sizes, not the original artwork dimensions. Prices
            vary by size.
          </p>
          <div className="purchase-row">
            <QuantityControl
              value={Math.min(quantity, Math.max(available, 1))}
              max={available}
              onChange={setQuantity}
              label={painting.title}
            />
            <button
              className="gallery-button"
              disabled={available < 1}
              onClick={() => {
                if (addToCart(painting.id, size, Math.min(quantity, available)))
                  setQuantity(1);
              }}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              {stock === 0
                ? "Out of stock"
                : available < 1
                  ? "All stock is in your cart"
                  : "Add to cart"}
            </button>
          </div>
          {inCart(painting.id) > 0 && (
            <Link className="inline-link" to="/cart">
              <Check size={14} aria-hidden="true" />
              {inCart(painting.id)}{" "}
              {inCart(painting.id) === 1 ? "print" : "prints"} in your cart
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
          <div className="product-perks">
            <span>
              <Package size={15} aria-hidden="true" />
              Unframed prints
            </span>
            <span>
              <Truck size={15} aria-hidden="true" />
              Free shipping from Rp500,000
            </span>
          </div>
          <div className="attribution-note">
            <strong>Artwork notes</strong>
            <p>
              {painting.attribution ||
                `Image reproduction of a work by ${painting.artist}. Products and sales on this website are a learning simulation only.`}{" "}
              Eras are simplified catalog categories; adaptations are grouped as
              contemporary.
            </p>
          </div>
        </div>
      </section>
      <Reviews painting={painting} />
      <section className="related-section" aria-labelledby="related-title">
        <div className="collection-heading">
          <div>
            <p className="section-eyebrow">KEEP EXPLORING</p>
            <h2 id="related-title">You might also like.</h2>
          </div>
          <Link className="inline-link" to="/#koleksi">
            All artworks
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="collection-grid">
          {paintings
            .filter((other) => other.id !== painting.id)
            .sort(
              (a, b) =>
                Number(b.subject === painting.subject) -
                Number(a.subject === painting.subject),
            )
            .slice(0, 4)
            .map((other) => (
              <PaintingCard key={other.id} painting={other} />
            ))}
        </div>
      </section>
    </div>
  );
}

export default function ProductDetail() {
  const { paintings } = useShop();
  const { id } = useParams();
  const painting = paintings.find((entry) => String(entry.id) === id);
  return painting ? (
    <PaintingDetail key={painting.id} painting={painting} />
  ) : (
    <NotFound />
  );
}
