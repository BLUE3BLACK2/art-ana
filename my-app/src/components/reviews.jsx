import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { useShop } from "../context/shop";

export default function Reviews({ painting }) {
  const { reviews, ratingFor, addReview } = useShop();
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const productReviews = reviews.filter(
    (review) => review.paintingId === painting.id,
  );
  const summary = ratingFor(painting.id);
  function submitReview(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (
      !addReview(painting.id, {
        name: String(data.get("name")),
        comment: String(data.get("comment")),
        rating,
      })
    ) {
      setError("Please enter a valid name, rating, and comment.");
      return;
    }
    form.reset();
    setRating(5);
    setError("");
  }
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="collection-heading">
        <div>
          <p className="section-eyebrow">FROM OUR VISITORS</p>
          <h2 id="reviews-title">Your opinion matters.</h2>
        </div>
        <p className="review-score">
          <Star
            size={18}
            fill={summary.count ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {summary.count
            ? `${summary.average.toFixed(1)} / 5 · ${summary.count} reviews`
            : "No reviews yet"}
        </p>
      </div>
      <div className="reviews-grid">
        <div className="review-list">
          {productReviews.length ? (
            productReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-top">
                  <strong>{review.name}</strong>
                  <time dateTime={review.date}>
                    {new Date(review.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <div
                  className="stars"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={13}
                      fill={star <= review.rating ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p>{review.comment}</p>
              </article>
            ))
          ) : (
            <div className="review-empty">
              <MessageSquare size={28} aria-hidden="true" />
              <h3>Be the first to share.</h3>
              <p>What do you love about this piece?</p>
            </div>
          )}
        </div>
        <form className="review-form" onSubmit={submitReview}>
          <h3>Write a review</h3>
          <fieldset>
            <legend>Rating</legend>
            <div className="rating-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <label
                  key={star}
                  title={`${star} ${star === 1 ? "star" : "stars"}`}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  />
                  <Star
                    size={25}
                    fill={star <= rating ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field">
            <span>Name</span>
            <input
              name="name"
              required
              maxLength={50}
              placeholder="Display name"
              autoComplete="nickname"
            />
          </label>
          <label className="field">
            <span>Comment</span>
            <textarea
              name="comment"
              required
              minLength={3}
              maxLength={1000}
              rows={4}
              placeholder="Share your thoughts about this artwork…"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="gallery-button" type="submit">
            Submit review
            <MessageSquare size={15} aria-hidden="true" />
          </button>
          <p className="field-hint">
            Reviews are saved in this browser only, not shared with other
            visitors.
          </p>
        </form>
      </div>
    </section>
  );
}
