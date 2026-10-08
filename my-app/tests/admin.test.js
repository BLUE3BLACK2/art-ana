import test from "node:test";
import assert from "node:assert/strict";
import {
  loadWorkspace,
  saveArtwork,
  deleteArtwork,
  moderateReview,
  changeOrderStatus,
  validateArtwork,
  validDemoLogin,
  validImage,
} from "../src/lib/admin.js";
import {
  availableStock,
  addCartItem,
  createOrder,
  unitPrice,
} from "../src/lib/shop.js";

const draft = {
  title: "Test artwork",
  artist: "Test artist",
  origin: "Indonesia",
  era: "Modern",
  subject: "Abstract",
  description: "A test work.",
  attribution: "Test only.",
  image: "/images/paintings/composition-8.png",
  price: 300000000,
  stock: 4,
};

test("workspace migrates previous storage without losing orders or reviews", () => {
  const fresh = loadWorkspace(null);
  assert.equal(fresh.catalog.length, 16);
  assert.equal(
    loadWorkspace(JSON.parse(JSON.stringify(fresh))).catalog.length,
    16,
  );
  const state = createOrder(
    addCartItem(fresh, fresh.catalog[0], "30x40", 1),
    fresh.catalog,
    "ART-OLD",
    "2026-10-08",
  ).state;
  delete state.catalog;
  const restored = loadWorkspace(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.catalog.length, 16);
  assert.equal(restored.orders[0].status, "Pending");
  assert.equal(restored.orders[0].items[0].title, "Muscle Lisa");
});

test("admin can add, edit price, adjust available stock, and persist catalog", () => {
  const fresh = loadWorkspace(null);
  let state = saveArtwork(fresh, draft);
  const artwork = state.catalog.at(-1);
  assert.equal(state.catalog.length, 17);
  assert.equal(artwork.title, draft.title);
  state = createOrder(
    addCartItem(state, artwork, "30x40", 1),
    state.catalog,
    "ART-NEW",
    "2026-10-08",
  ).state;
  state = addCartItem(state, artwork, "30x40", 3);
  state = saveArtwork(
    state,
    { ...draft, price: 400000000, stock: 1 },
    artwork.id,
  );
  assert.equal(availableStock(state.catalog.at(-1), state), 1);
  assert.equal(state.cart[0].quantity, 1);
  assert.equal(unitPrice(state.catalog.at(-1), "60x90"), 880000000);
  assert.equal(state.orders[0].items[0].price, 300000000);
  const restored = loadWorkspace(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.catalog.at(-1).price, 400000000);
  assert.equal(availableStock(restored.catalog.at(-1), restored), 1);
  assert.equal(fresh.catalog.length, 16);
});

test("deleting artwork clears its cart/reviews while retaining order history after reload", () => {
  let state = loadWorkspace(null);
  const artwork = state.catalog[0];
  state = createOrder(
    addCartItem(state, artwork, "30x40", 1),
    state.catalog,
    "ART-KEEP",
    "2026-10-08",
  ).state;
  state = addCartItem(state, artwork, "30x40", 1);
  state.reviews = [
    {
      id: "review",
      paintingId: artwork.id,
      name: "Test",
      rating: 5,
      comment: "Test comment",
      date: "2026-10-08",
    },
  ];
  const deleted = deleteArtwork(state, artwork.id);
  assert.equal(deleted.catalog.length, 15);
  assert.equal(deleted.cart.length, 0);
  assert.equal(deleted.reviews.length, 0);
  const restored = loadWorkspace(JSON.parse(JSON.stringify(deleted)));
  assert.equal(restored.orders[0].items[0].title, artwork.title);
  assert.equal(restored.orders[0].total, 250000000);
  assert.equal(restored.catalog.length, 15);
  assert.equal(loadWorkspace({ catalog: [] }).catalog.length, 0);
});

test("status and review moderation survive reload, never double-adjusting stock", () => {
  let state = loadWorkspace(null);
  state = createOrder(
    addCartItem(state, state.catalog[0], "30x40", 1),
    state.catalog,
    "ART-STATUS",
    "2026-10-08",
  ).state;
  const stock = { ...state.stockUsed };
  state = changeOrderStatus(state, "ART-STATUS", "Cancelled");
  assert.deepEqual(state.stockUsed, stock);
  assert.equal(changeOrderStatus(state, "ART-STATUS", "Invalid"), state);
  state.reviews = [
    {
      id: "review",
      paintingId: 1,
      name: "Test",
      rating: 5,
      comment: "Test comment",
      date: "2026-10-08",
    },
  ];
  state = moderateReview(state, "review", "toggle");
  state = loadWorkspace(JSON.parse(JSON.stringify(state)));
  assert.equal(state.orders[0].status, "Cancelled");
  assert.equal(state.reviews[0].hidden, true);
  state = moderateReview(state, "review", "toggle");
  assert.equal(state.reviews[0].hidden, false);
  assert.equal(moderateReview(state, "review", "delete").reviews.length, 0);
});

test("admin input validation rejects invalid data and unsafe images", () => {
  assert.equal(validateArtwork(draft), "");
  for (const bad of [
    { price: 990000000 },
    { stock: -1 },
    { stock: 1.5 },
    { title: " " },
    { era: "Unknown" },
    { image: "javascript:alert(1)" },
    { image: "" },
  ]) {
    assert.ok(validateArtwork({ ...draft, ...bad }));
    assert.equal(saveArtwork(loadWorkspace(null), { ...draft, ...bad }), null);
  }
  assert.equal(validImage("data:image/svg+xml;base64,AAAA"), false);
  assert.equal(validImage("https://example.com/tracker.png"), false);
  assert.equal(validDemoLogin("admin", "wrong"), false);
  assert.equal(validDemoLogin(" admin ", "Artana2026!"), true);
});

test("custom uploaded images persist without choosing a catalog image", () => {
  const customImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jrXcAAAAASUVORK5CYII=";
  const customDraft = { ...draft, title: "My own artwork", image: customImage };
  assert.equal(validateArtwork(customDraft), "");
  const state = saveArtwork(loadWorkspace(null), customDraft);
  const restored = loadWorkspace(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.catalog.at(-1).title, customDraft.title);
  assert.equal(restored.catalog.at(-1).image, customImage);
  const replacementImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  const updated = saveArtwork(
    restored,
    { ...customDraft, image: replacementImage },
    restored.catalog.at(-1).id,
  );
  assert.equal(updated.catalog.at(-1).image, replacementImage);
});
