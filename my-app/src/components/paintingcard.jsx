import { Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/shop";
import { formatPrice } from "../lib/shop";

// Props painting: satu komponen dapat dipakai untuk seluruh produk katalog.
export default function PaintingCard({ painting }) {
  const { addToCart, stockFor, inCart, ratingFor } = useShop();
  const stock = stockFor(painting.id);
  const rating = ratingFor(painting.id);
  return (
    <article className="collection-card">
      <div
        className="collection-image"
        style={{ "--painting-image": `url("${painting.image}")` }}
      >
        <img
          src={painting.image}
          alt={painting.title}
          loading="lazy"
          width="400"
          height="500"
        />
        <span className="image-tag">{painting.era}</span>
        {stock === 0 && <span className="sold-out">Out of stock</span>}
      </div>
      <div className="collection-card-body">
        <p className="collection-subject">{painting.subject}</p>
        <h3>
          <Link
            className="card-detail-link"
            to={`/product/${painting.id}`}
            aria-label={`View details for ${painting.title}`}
          >
            {painting.title}
          </Link>
        </h3>
        <p className="artist-line">{painting.artist}</p>
        <div className="card-rating">
          <Star
            size={12}
            fill={rating.count ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {rating.count
            ? `${rating.average.toFixed(1)} · ${rating.count} reviews`
            : "No reviews yet"}
        </div>
        <div className="card-bottom">
          <div>
            <span className="tiny-label">FROM</span>
            <p className="card-price">{formatPrice(painting.price)}</p>
          </div>
          <button
            className="icon-button add-button"
            onClick={() => addToCart(painting.id)}
            disabled={stock <= inCart(painting.id)}
            aria-label={`Add ${painting.title} to cart`}
            title="Add 30 × 40 cm print"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
