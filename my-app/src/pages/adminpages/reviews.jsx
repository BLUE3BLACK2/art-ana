import { useState } from "react";
import { Eye, EyeOff, MessageSquare, Search, Star, Trash2 } from "lucide-react";
import { useShop } from "../../context/shop";
import { DeleteConfirmation } from "../../components/admindialog";

export default function AdminReviews() {
  const { reviews, paintings, moderateReview } = useShop();
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("");
  const [deleting, setDeleting] = useState(null);
  const filtered = reviews.filter(
    (review) =>
      (!visibility ||
        (visibility === "hidden" ? review.hidden : !review.hidden)) &&
      `${review.name} ${review.comment} ${paintings.find((p) => p.id === review.paintingId)?.title || ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="section-eyebrow">VOICES FROM YOUR GALLERY</p>
          <h1>A space for feedback.</h1>
          <p className="admin-muted">
            Keep the conversation thoughtful. Hidden reviews do not affect
            ratings.
          </p>
        </div>
      </div>
      <div className="studio-toolbar">
        <label className="search-field">
          <Search size={17} />
          <span className="sr-only">Search reviews</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews or artworks…"
          />
        </label>
        <label className="field">
          <span className="sr-only">Filter review visibility</span>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">All reviews</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
      </div>
      <div className="studio-review-grid">
        {filtered.length ? (
          filtered.map((review) => (
            <article className="studio-card" key={review.id}>
              <div className="studio-section-heading">
                <strong>{review.name}</strong>
                <span className="studio-badge">
                  {review.hidden ? "Hidden" : "Visible"}
                </span>
              </div>
              <p className="admin-muted">
                {paintings.find((p) => p.id === review.paintingId)?.title}
              </p>
              <div
                className="stars"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="studio-review-comment">{review.comment}</p>
              <time className="admin-muted" dateTime={review.date}>
                {new Date(review.date).toLocaleDateString("en-GB")}
              </time>
              <div className="studio-artwork-actions">
                <button
                  className="secondary-button"
                  onClick={() => moderateReview(review.id, "toggle")}
                  aria-label={`${review.hidden ? "Show" : "Hide"} review by ${review.name}`}
                >
                  {review.hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                  {review.hidden ? "Show review" : "Hide review"}
                </button>
                <button
                  className="icon-button"
                  onClick={() => setDeleting(review)}
                  aria-label={`Delete review by ${review.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="studio-card studio-empty">
            <MessageSquare size={28} />
            <h2>No feedback to show.</h2>
            <p>Visitor reviews from this browser will appear here.</p>
          </div>
        )}
      </div>
      {deleting && (
        <DeleteConfirmation
          title="Delete this review?"
          description={`The review by ${deleting.name} will be permanently removed from this browser. You can hide it instead to keep a record.`}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            moderateReview(deleting.id, "delete");
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
