import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeroPainting({ painting, index }) {
  return (
    <figure className={`hero-painting hero-painting-${index + 1}`}>
      <figcaption className="hero-subject">{painting.subject}</figcaption>
      <Link
        to={`/product/${painting.id}`}
        className="hero-painting-frame"
        aria-label={`View ${painting.title}`}
      >
        <img src={painting.image} alt={painting.title} fetchPriority="high" />
      </Link>
      <span className="sr-only">{painting.title}</span>
    </figure>
  );
}

export default function Hero({ paintings }) {
  return (
    <section className="gallery-hero" aria-labelledby="hero-title">
      <p className="hero-eyebrow">A SPACE FOR ART</p>
      <h1 id="hero-title">
        Find art that
        <br />
        <span>speaks to you.</span>
      </h1>

      <div
        className="hero-artworks"
        aria-label="Selected artworks representing four subjects"
      >
        {paintings.map((painting, index) => (
          <HeroPainting key={painting.id} painting={painting} index={index} />
        ))}
      </div>

      <p className="hero-description">
        From portraits full of character to abstract worlds.
        <br className="hero-desktop-break" />
        Find a piece that feels like you, and make room for its story.
      </p>
      <div className="hero-actions">
        <a className="gallery-button" href="#koleksi">
          Explore the collection <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="hero-secondary-link" href="#tentang">
          About art-ana <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
      <p className="hero-footnote">SELECTED ART. DIFFERENT STORIES.</p>
    </section>
  );
}
