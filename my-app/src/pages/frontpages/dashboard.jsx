import { useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import Hero from "../../components/hero";
import PaintingCard from "../../components/paintingcard";
import { featuredPaintings, paintings } from "../../data/paintings";
import { useShop } from "../../context/shop";

const initialFilters = {
  era: "",
  origin: "",
  subject: "",
  price: "",
  artist: "",
  stock: "",
};
const uniqueValues = (key) => [
  ...new Set(paintings.map((painting) => painting[key])),
];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("curated");
  const [showFilters, setShowFilters] = useState(false);
  const { stockFor, ratingFor } = useShop();
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const filterBy = (key, value) =>
    setFilters((previous) => ({ ...previous, [key]: value }));
  const filtered = paintings
    .filter((painting) => {
      const searchable =
        `${painting.title} ${painting.artist} ${painting.subject} ${painting.origin}`.toLowerCase();
      return (
        searchable.includes(query.trim().toLowerCase()) &&
        ["era", "origin", "subject", "artist"].every(
          (key) => !filters[key] || painting[key] === filters[key],
        ) &&
        (!filters.price ||
          (filters.price === "low"
            ? painting.price < 275000000
            : filters.price === "mid"
              ? painting.price >= 275000000 && painting.price <= 350000000
              : painting.price > 350000000)) &&
        (!filters.stock ||
          (filters.stock === "available"
            ? stockFor(painting.id) > 0
            : stockFor(painting.id) === 0))
      );
    })
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "rating"
            ? ratingFor(b.id).average - ratingFor(a.id).average
            : a.id - b.id,
    );

  return (
    <>
      <Hero paintings={featuredPaintings} />
      <section
        id="koleksi"
        className="gallery-collection"
        aria-labelledby="collection-title"
      >
        <div className="collection-heading">
          <div>
            <p className="section-eyebrow">CURATED BY ART-ANA</p>
            <h2 id="collection-title">Find your perspective.</h2>
          </div>
        </div>
        <div className="catalog-toolbar">
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search by title or artist</span>
            <input
              type="search"
              placeholder="Search by title or artist…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className={`secondary-button filter-toggle ${showFilters ? "selected" : ""}`}
            aria-expanded={showFilters}
            aria-controls="catalog-filters"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filter
            {activeFilters > 0 && (
              <span className="cart-badge">{activeFilters}</span>
            )}
          </button>
          <label className="sort-label">
            <span className="sr-only">Sort artworks</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="curated">Gallery picks</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
        {showFilters && (
          <div className="filters-panel" id="catalog-filters">
            <FilterSelect
              label="Era"
              value={filters.era}
              options={uniqueValues("era")}
              onChange={(value) => filterBy("era", value)}
            />
            <FilterSelect
              label="Artist origin"
              value={filters.origin}
              options={uniqueValues("origin")}
              onChange={(value) => filterBy("origin", value)}
            />
            <FilterSelect
              label="Artwork subject"
              value={filters.subject}
              options={uniqueValues("subject")}
              onChange={(value) => filterBy("subject", value)}
            />
            <FilterSelect
              label="Starting price"
              value={filters.price}
              options={[
                { value: "low", label: "Under Rp275 million" },
                { value: "mid", label: "Rp275 million – Rp350 million" },
                { value: "high", label: "Over Rp350 million" },
              ]}
              onChange={(value) => filterBy("price", value)}
            />
            <FilterSelect
              label="Artist / reference"
              value={filters.artist}
              options={uniqueValues("artist")}
              onChange={(value) => filterBy("artist", value)}
            />
            <FilterSelect
              label="Availability"
              value={filters.stock}
              options={[
                { value: "available", label: "In stock" },
                { value: "sold", label: "Out of stock" },
              ]}
              onChange={(value) => filterBy("stock", value)}
            />
            <button
              className="text-button reset-filter"
              onClick={() => {
                setFilters(initialFilters);
                setQuery("");
              }}
            >
              <X size={14} aria-hidden="true" />
              Reset filters
            </button>
          </div>
        )}
        {filtered.length ? (
          <div className="collection-grid catalog-grid">
            {filtered.map((painting) => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={32} aria-hidden="true" />
            <h3>Nothing caught your eye yet?</h3>
            <p>Try a different search or adjust your filters.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setFilters(initialFilters);
                setQuery("");
              }}
            >
              Show all artworks
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
      <section
        id="tentang"
        className="gallery-about"
        aria-labelledby="about-title"
      >
        <div>
          <p className="section-eyebrow">ABOUT ART-ANA</p>
          <h2 id="about-title">
            Art for your space <br />
            and your soul.
          </h2>
        </div>
        <div>
          <p>
            The classic, the bold, and the slightly unexpected. art-ana brings
            diverse artworks together in one space, from Indonesian artists to
            international references.
          </p>
        </div>
      </section>
    </>
  );
}
