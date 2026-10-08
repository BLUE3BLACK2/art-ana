import { useState } from "react";
import { ArrowUpRight, Frame, Plus, Search, Upload } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../../context/shop";
import { eras, subjects, validateArtwork } from "../../lib/admin";
import AdminDialog, { DeleteConfirmation } from "../../components/admindialog";
import PaintingCard from "../../components/paintingcard";

export function ArtworkForm({ painting, onClose }) {
  const { saveArtwork, stockFor } = useShop();
  const [draft, setDraft] = useState(() => ({
    title: painting?.title || "",
    artist: painting?.artist || "",
    origin: painting?.origin || "International",
    era: painting?.era || "Contemporary",
    subject: painting?.subject || "People / Portraits",
    price: painting?.price || 250000000,
    stock: painting ? stockFor(painting.id) : 1,
    description: painting?.description || "",
    attribution: painting?.attribution || "",
    image: painting?.image || "",
  }));
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);
  const update = (key, value) =>
    setDraft((previous) => ({ ...previous, [key]: value }));
  function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 1024 * 1024
    ) {
      setImageError("Use a PNG, JPEG, or WebP image up to 1 MB.");
      event.target.value = "";
      return;
    }
    setUploading(true);
    setImageError("");
    const reader = new FileReader();
    reader.onerror = () => {
      setImageError("The image could not be read. Please choose it again.");
      event.target.value = "";
      setUploading(false);
    };
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        update("image", String(reader.result));
        setImageName(file.name);
        setImageError("");
        setError("");
        setUploading(false);
      };
      image.onerror = () => {
        setImageError(
          "This file is not a valid image. Please choose another file.",
        );
        event.target.value = "";
        setUploading(false);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }
  function submit(event) {
    event.preventDefault();
    if (uploading) return;
    const message = validateArtwork(draft);
    if (message) {
      setError(message);
      return;
    }
    const clean = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    );
    if (!saveArtwork(clean, painting?.id)) {
      setError("The artwork could not be saved. Please check the fields.");
      return;
    }
    onClose();
  }
  return (
    <AdminDialog
      title={painting ? "Edit artwork" : "Add an artwork"}
      onClose={onClose}
      wide
    >
      <form onSubmit={submit}>
        <div className="studio-editor-grid">
          <div className="studio-editor-image">
            <div
              className={`studio-image-preview${draft.image ? "" : " studio-image-empty"}`}
              style={
                draft.image
                  ? { "--painting-image": `url("${draft.image}")` }
                  : undefined
              }
              aria-busy={uploading}
            >
              {draft.image ? (
                <img src={draft.image} alt="Artwork preview" />
              ) : (
                <div className="studio-image-placeholder">
                  <Frame size={32} aria-hidden="true" />
                  <strong>No image selected</strong>
                  <p>Upload your artwork to see its preview here.</p>
                </div>
              )}
            </div>
            <label
              className={`gallery-button studio-upload${uploading ? " is-uploading" : ""}`}
            >
              <Upload size={16} aria-hidden="true" />
              <span>
                {uploading
                  ? "Reading image…"
                  : draft.image
                    ? "Replace artwork image"
                    : "Upload artwork image"}
              </span>
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={upload}
                disabled={uploading}
                aria-label="Upload artwork image"
                aria-describedby="artwork-image-hint artwork-image-status"
              />
            </label>
            <p
              className="field-hint studio-image-status"
              id="artwork-image-status"
              role="status"
            >
              {uploading
                ? "Preparing your preview…"
                : imageName ||
                  (draft.image
                    ? "Current artwork image. Upload a file to replace it."
                    : "Choose an image from your device, not from the catalog.")}
            </p>
            <p className="field-hint" id="artwork-image-hint">
              PNG, JPEG, or WebP · Up to 1 MB per image for browser storage. Use
              images you have permission to reproduce.
            </p>
            {imageError && (
              <p className="form-error" role="alert">
                {imageError}
              </p>
            )}
          </div>
          <div className="form-grid">
            <label className="field span-two">
              <span>Artwork title</span>
              <input
                required
                maxLength={150}
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Give this piece a name"
              />
            </label>
            <label className="field span-two">
              <span>Artist / reference</span>
              <input
                required
                maxLength={150}
                value={draft.artist}
                onChange={(e) => update("artist", e.target.value)}
                placeholder="Artist or adaptation reference"
              />
            </label>
            <label className="field">
              <span>Era</span>
              <select
                value={draft.era}
                onChange={(e) => update("era", e.target.value)}
              >
                {eras.map((era) => (
                  <option key={era}>{era}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Subject</span>
              <select
                value={draft.subject}
                onChange={(e) => update("subject", e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label className="field span-two">
              <span>Artist / reference origin</span>
              <input
                required
                maxLength={150}
                value={draft.origin}
                onChange={(e) => update("origin", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Starting price (IDR)</span>
              <input
                type="number"
                min={100000000}
                max={450000000}
                step={1000}
                required
                value={draft.price}
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Available stock</span>
              <input
                type="number"
                min={0}
                max={10000}
                step={1}
                required
                value={draft.stock}
                onChange={(e) => update("stock", Number(e.target.value))}
              />
            </label>
            <p className="field-hint span-two">
              Starting price: Rp100–450 million. Size multipliers keep every
              print under Rp1 billion. Stock changes update the cart too.
            </p>
            <label className="field span-two">
              <span>Description</span>
              <textarea
                required
                maxLength={2000}
                rows={3}
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </label>
            <label className="field span-two">
              <span>Artwork notes / attribution</span>
              <textarea
                maxLength={2000}
                rows={2}
                value={draft.attribution}
                onChange={(e) => update("attribution", e.target.value)}
              />
            </label>
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="studio-dialog-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="gallery-button"
            type="submit"
            disabled={uploading || !draft.image}
          >
            {uploading ? "Reading image…" : "Save artwork"}
            <ArrowUpRight size={15} />
          </button>
        </div>
      </form>
    </AdminDialog>
  );
}

export default function AdminArtworks() {
  const { paintings, deleteArtwork } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const filtered = paintings.filter((p) =>
    `${p.title} ${p.artist}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="section-eyebrow">CURATE YOUR COLLECTION</p>
          <h1>Artworks with character.</h1>
          <p className="admin-muted">
            Give every piece its place. Edit the details, price, and stock.
          </p>
        </div>
        <button className="gallery-button" onClick={() => setEditor({})}>
          <Plus size={16} />
          Add artwork
        </button>
      </div>
      <div className="studio-toolbar">
        <label className="search-field">
          <Search size={17} />
          <span className="sr-only">Search artworks</span>
          <input
            type="search"
            placeholder="Search by title or artist…"
            value={query}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("q", e.target.value);
              else next.delete("q");
              setSearchParams(next, { replace: true });
            }}
          />
        </label>
        <span className="admin-muted">
          {filtered.length} {filtered.length === 1 ? "artwork" : "artworks"}
        </span>
      </div>
      {filtered.length ? (
        <div className="studio-artwork-grid">
          {filtered.map((p) => (
            <PaintingCard
              key={p.id}
              painting={p}
              admin
              onEdit={setEditor}
              onDelete={setDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="studio-card studio-empty">
          <Frame size={28} />
          <h2>No artworks found.</h2>
          <p>Add a piece or try a different search.</p>
        </div>
      )}
      {editor && (
        <ArtworkForm
          painting={editor.id ? editor : null}
          onClose={() => setEditor(null)}
        />
      )}
      {deleting && (
        <DeleteConfirmation
          title={`Delete ${deleting.title}?`}
          description="This removes the artwork from the gallery, its cart entries, and its reviews in this browser. Existing orders stay in your history. This cannot be undone."
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            deleteArtwork(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
