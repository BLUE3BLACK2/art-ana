import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Frame,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { useShop } from "../../context/shop";
import { formatPrice, sizeLabel, unitPrice } from "../../lib/shop";
import { ArtworkForm } from "./artworks";
import { DeleteConfirmation } from "../../components/admindialog";

export default function AdminArtworkDetail() {
  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { paintings, stockFor, ratingFor, reviews, deleteArtwork } = useShop();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const painting = paintings.find((p) => String(p.id) === id);
  const collectionPath = `/admin/artworks${search}`;
  if (!painting)
    return (
      <div className="studio-card studio-empty">
        <Frame size={32} aria-hidden="true" />
        <h1>Artwork not found.</h1>
        <p>This artwork may have been removed from the collection.</p>
        <Link to={collectionPath} className="gallery-button">
          <ArrowLeft size={16} />
          Back to artworks
        </Link>
      </div>
    );
  const rating = ratingFor(painting.id);
  const artworkReviews = reviews.filter((r) => r.paintingId === painting.id);
  return (
    <>
      <Link className="back-link" to={collectionPath}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to artworks
      </Link>
      <section
        className="product-grid studio-detail-grid"
        aria-labelledby="admin-artwork-title"
      >
        <div
          className="product-art"
          style={{ "--painting-image": `url("${painting.image}")` }}
        >
          <img src={painting.image} alt={painting.title} fetchPriority="high" />
          <span className="art-caption">ART-ANA COLLECTION</span>
        </div>
        <div className="product-info">
          <p className="section-eyebrow">ARTWORK DETAILS / {painting.era}</p>
          <h1 id="admin-artwork-title">{painting.title}</h1>
          <p className="product-artist">{painting.artist}</p>
          <Link className="product-rating" to="/admin/reviews">
            <Star
              size={15}
              fill={rating.count ? "currentColor" : "none"}
              aria-hidden="true"
            />
            {rating.count
              ? `${rating.average.toFixed(1)} · ${rating.count} reviews`
              : "No reviews yet"}
          </Link>
          <p className="product-price">{formatPrice(painting.price)}</p>
          <p className="product-description">{painting.description}</p>
          <dl className="product-facts">
            {[
              ["Subject", painting.subject],
              ["Artist / reference origin", painting.origin],
              ["Era", painting.era],
              ["Available stock", `${stockFor(painting.id)} prints`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <section
            className="studio-detail-prices"
            aria-label="Prices by print size"
          >
            <h2>Print sizes & prices</h2>
            {painting.sizes.map((size) => (
              <div key={size}>
                <span>{sizeLabel(size)}</span>
                <strong>{formatPrice(unitPrice(painting, size))}</strong>
              </div>
            ))}
          </section>
          <div className="studio-detail-actions">
            <button className="gallery-button" onClick={() => setEditing(true)}>
              <Pencil size={16} aria-hidden="true" />
              Edit artwork
            </button>
            <button
              className="secondary-button"
              onClick={() => setDeleting(true)}
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete artwork
            </button>
          </div>
          {painting.attribution && (
            <div className="attribution-note">
              <strong>Artwork notes</strong>
              <p>{painting.attribution}</p>
            </div>
          )}
        </div>
      </section>
      <section className="studio-card studio-detail-reviews">
        <div className="studio-section-heading">
          <h2>Visitor feedback</h2>
          <Link to="/admin/reviews" className="inline-link">
            Manage reviews
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <p className="admin-muted">
          {artworkReviews.length} reviews ·{" "}
          {artworkReviews.filter((r) => r.hidden).length} hidden. Only visible
          reviews contribute to the gallery rating.
        </p>
      </section>
      {editing && (
        <ArtworkForm painting={painting} onClose={() => setEditing(false)} />
      )}
      {deleting && (
        <DeleteConfirmation
          title={`Delete ${painting.title}?`}
          description="This removes the artwork from the gallery, its cart entries, and its reviews in this browser. Existing orders stay in your history. This cannot be undone."
          onClose={() => setDeleting(false)}
          onConfirm={() => {
            deleteArtwork(painting.id);
            navigate(collectionPath, { replace: true });
          }}
        />
      )}
    </>
  );
}
