import { paintings as initialCatalog } from "../data/paintings.js";
import { printSizes } from "../data/printoptions.js";
import { normalizeShopState } from "./shop.js";

export const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Completed",
  "Cancelled",
];
export const eras = ["Classic", "Modern", "Contemporary"];
export const subjects = [
  "People / Portraits",
  "Landscape",
  "Abstract",
  "Still life",
  "Animals",
];
// Public demo credentials, not a security boundary. Real authentication needs a server.
export const demoAdmin = { username: "admin", password: "Artana2026!" };
export const validDemoLogin = (username, password) =>
  username.trim() === demoAdmin.username && password === demoAdmin.password;

export function validImage(value) {
  return (
    typeof value === "string" &&
    value.length <= 2000000 &&
    (/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(value) ||
      /^\/images\/paintings\/[a-z0-9-]+\.png$/.test(value))
  );
}

export function validateArtwork(value) {
  if (
    !value ||
    ["title", "artist", "origin", "description"].some(
      (key) =>
        typeof value[key] !== "string" ||
        !value[key].trim() ||
        value[key].length > (key === "description" ? 2000 : 150),
    )
  )
    return "Complete the title, artist, origin, and description.";
  if (!eras.includes(value.era) || !subjects.includes(value.subject))
    return "Choose a valid era and subject.";
  if (!validImage(value.image))
    return "Choose an artwork image (PNG, JPEG, or WebP, up to 1 MB).";
  if (
    !Number.isSafeInteger(value.price) ||
    value.price < 100000000 ||
    value.price > 450000000
  )
    return "Starting price must be between Rp100 million and Rp450 million.";
  if (
    !Number.isSafeInteger(value.stock) ||
    value.stock < 0 ||
    value.stock > 10000
  )
    return "Available stock must be a whole number from 0 to 10,000.";
  if (
    value.attribution !== undefined &&
    (typeof value.attribution !== "string" || value.attribution.length > 2000)
  )
    return "Artwork notes must be under 2,000 characters.";
  return "";
}

export function loadWorkspace(value) {
  // Recover the unversioned development draft that filtered out optional notes.
  // Versioned catalogs (including intentionally empty catalogs) stay untouched.
  const draftIds = [1, 5, 6, 11, 12, 13, 14, 15, 16];
  const recoverDraft =
    !value?.catalogVersion &&
    Array.isArray(value?.catalog) &&
    value?.catalog?.length === draftIds.length &&
    value.catalog.every(
      (p) =>
        p &&
        draftIds.includes(p.id) &&
        JSON.stringify(p) ===
          JSON.stringify(initialCatalog.find((entry) => entry.id === p.id)),
    );
  const catalog = recoverDraft
    ? initialCatalog
    : Array.isArray(value?.catalog)
      ? value.catalog.filter(
          (p, index, list) =>
            p &&
            Number.isSafeInteger(p.id) &&
            p.id > 0 &&
            list.findIndex((entry) => entry?.id === p.id) === index &&
            !validateArtwork({ ...p, stock: Math.min(p.stock, 10000) }) &&
            Array.isArray(p.sizes) &&
            p.sizes.length > 0 &&
            p.sizes.every((size) =>
              printSizes.some((entry) => entry.value === size),
            ),
        )
      : initialCatalog;
  const state = normalizeShopState(value, catalog);
  return { ...state, catalog, catalogVersion: 1 };
}

export function saveArtwork(state, draft, id) {
  if (validateArtwork(draft)) return null;
  const existing = state.catalog.find((p) => p.id === id);
  if (id && !existing) return null;
  const artworkId =
    existing?.id ??
    Math.max(
      0,
      ...state.catalog.map((p) => p.id),
      ...state.orders.flatMap((order) => order.items.map((item) => item.id)),
    ) + 1;
  const used = state.stockUsed[artworkId] || 0;
  const artwork = {
    ...existing,
    ...draft,
    id: artworkId,
    stock: used + draft.stock,
    sizes: printSizes.map((size) => size.value),
  };
  const catalog = existing
    ? state.catalog.map((p) => (p.id === id ? artwork : p))
    : [...state.catalog, artwork];
  return {
    ...normalizeShopState({ ...state, catalog }, catalog),
    catalog,
    catalogVersion: 1,
  };
}

export function deleteArtwork(state, id) {
  if (!state.catalog.some((p) => p.id === id)) return state;
  const orders = state.orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const artwork = state.catalog.find((p) => p.id === item.id);
      return {
        ...item,
        title: item.title || artwork?.title || "Removed artwork",
        image: item.image || artwork?.image || "",
      };
    }),
  }));
  const catalog = state.catalog.filter((p) => p.id !== id);
  return {
    ...normalizeShopState({ ...state, orders }, catalog),
    catalog,
    catalogVersion: 1,
  };
}

export function changeOrderStatus(state, id, status) {
  if (!orderStatuses.includes(status)) return state;
  // Status is administrative only: changing it never charges money or adjusts stock twice.
  return {
    ...state,
    orders: state.orders.map((order) =>
      order.id === id ? { ...order, status } : order,
    ),
  };
}

export function moderateReview(state, id, action) {
  if (action === "delete")
    return {
      ...state,
      reviews: state.reviews.filter((review) => review.id !== id),
    };
  if (action !== "toggle") return state;
  return {
    ...state,
    reviews: state.reviews.map((review) =>
      review.id === id ? { ...review, hidden: !review.hidden } : review,
    ),
  };
}
