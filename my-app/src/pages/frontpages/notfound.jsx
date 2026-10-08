import { ArrowLeft, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="empty-state page-content">
      <ImageOff size={38} aria-hidden="true" />
      <p className="section-eyebrow">404 / NOT FOUND</p>
      <h1>Artwork or page not found.</h1>
      <p>Head back and discover another artwork.</p>
      <Link className="gallery-button" to="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to gallery
      </Link>
    </section>
  );
}
