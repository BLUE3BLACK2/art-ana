import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "../context/shop";
import { formatPrice } from "../lib/shop";

// Props painting: satu komponen dapat dipakai untuk seluruh produk katalog.
export default function PaintingCard({
  painting,
  admin = false,
  onEdit,
  onDelete,
}) {
  const location = useLocation();
  const { addToCart, stockFor, inCart, ratingFor } = useShop();
  const stock = stockFor(painting.id);
  const rating = ratingFor(painting.id);
  return (
    <article
      className={`collection-card${admin ? " collection-card-admin" : ""}`}
    >
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
            to={
              admin
                ? `/admin/artworks/${painting.id}${location.search}`
                : `/product/${painting.id}`
            }
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
          {admin ? (
            <span className="studio-badge">{stock} in stock</span>
          ) : (
            <button
              className="icon-button add-button"
              onClick={() => addToCart(painting.id)}
              disabled={stock <= inCart(painting.id)}
              aria-label={`Add ${painting.title} to cart`}
              title="Add 30 × 40 cm print"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          )}
        </div>
        {admin && (
          <div className="studio-artwork-actions admin-card-actions">
            <button
              className="secondary-button"
              onClick={() => onEdit(painting)}
              aria-label={`Edit ${painting.title}`}
            >
              <Pencil size={14} aria-hidden="true" />
              Edit artwork
            </button>
            <button
              className="icon-button"
              onClick={() => onDelete(painting)}
              aria-label={`Delete ${painting.title}`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
