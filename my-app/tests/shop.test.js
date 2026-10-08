import assert from "node:assert/strict";
import test from "node:test";
import { paintings } from "../src/data/paintings.js";
import {
  addCartItem,
  availableStock,
  createOrder,
  emptyShop,
  normalizeShopState,
  shippingCost,
  unitPrice,
} from "../src/lib/shop.js";

const catalog = [
  {
    id: 1,
    title: "Contoh",
    price: 250000,
    sizes: ["30x40", "40x60", "60x90"],
    stock: 3,
  },
];
const painting = catalog[0];

test("semua harga katalog dan ukuran berada di ratusan juta hingga maksimal satu miliar", () => {
  assert.equal(paintings.length, 16);
  const prices = paintings.flatMap((artwork) =>
    artwork.sizes.map((size) => unitPrice(artwork, size)),
  );
  assert.equal(Math.min(...prices), 240000000);
  assert.equal(Math.max(...prices), 990000000);
  assert.ok(
    prices.every(
      (price) =>
        Number.isSafeInteger(price) &&
        price >= 100000000 &&
        price <= 1000000000,
    ),
  );
});

test("keranjang tersimpan memakai harga terbaru dan checkout menghitung harga ratusan juta", () => {
  const artwork = paintings[0];
  const restored = normalizeShopState(
    { cart: [{ id: artwork.id, size: "60x90", quantity: 2, price: 550000 }] },
    paintings,
  );
  const result = createOrder(
    restored,
    paintings,
    "ART-HIGH-VALUE",
    "2026-10-08",
  );
  assert.equal(result.order.items[0].price, 550000000);
  assert.equal(result.order.total, 1100000000);
  assert.equal(result.order.shipping, 0);
});

test("harga berubah sesuai ukuran dan ongkir mengikuti ambang gratis", () => {
  assert.equal(unitPrice(painting, "30x40"), 250000);
  assert.equal(unitPrice(painting, "40x60"), 350000);
  assert.equal(unitPrice(painting, "60x90"), 550000);
  assert.equal(shippingCost(0), 0);
  assert.equal(shippingCost(499999), 25000);
  assert.equal(shippingCost(500000), 0);
});

test("penambahan ukuran sama digabung, ukuran berbeda menjadi baris berbeda", () => {
  let state = addCartItem(emptyShop(), painting, "30x40", 1);
  state = addCartItem(state, painting, "30x40", 1);
  state = addCartItem(state, painting, "40x60", 1);
  assert.equal(state.cart.length, 2);
  assert.equal(state.cart[0].quantity, 2);
  assert.equal(state.cart[1].quantity, 1);
});

test("batas stok berlaku bersama untuk semua ukuran", () => {
  const state = addCartItem(emptyShop(), painting, "30x40", 2);
  assert.equal(addCartItem(state, painting, "40x60", 2), state);
  assert.equal(addCartItem(state, painting, "invalid", 1), state);
  assert.equal(addCartItem(state, painting, "30x40", -1), state);
  assert.equal(addCartItem(state, painting, "30x40", 1.5), state);
});

test("checkout menghitung total, mengosongkan cart, dan mengurangi stok", () => {
  const state = addCartItem(emptyShop(), painting, "40x60", 2);
  const result = createOrder(
    state,
    catalog,
    "ART-TEST",
    "2026-10-08T00:00:00.000Z",
  );
  assert.equal(result.order.total, 700000);
  assert.equal(result.order.shipping, 0);
  assert.equal(result.state.cart.length, 0);
  assert.equal(result.state.orders.length, 1);
  assert.equal(availableStock(painting, result.state), 1);
  assert.deepEqual(
    Object.keys(result.order).sort(),
    ["id", "date", "items", "shipping", "total"].sort(),
  );
  assert.equal(state.cart.length, 1); // Tidak memutasi state React sebelumnya.
});

test("checkout satu item menambahkan ongkir, cart kosong tidak dapat checkout", () => {
  assert.equal(createOrder(emptyShop(), catalog, "EMPTY", "2026-10-08"), null);
  const state = addCartItem(emptyShop(), painting, "30x40", 1);
  assert.equal(
    createOrder(state, catalog, "ONE", "2026-10-08").order.total,
    275000,
  );
});

test("checkout memvalidasi ulang stok, termasuk beberapa ukuran", () => {
  const state = {
    ...emptyShop(),
    cart: [
      { id: 1, size: "30x40", quantity: 2 },
      { id: 1, size: "40x60", quantity: 2 },
    ],
  };
  assert.equal(createOrder(state, catalog, "INVALID", "2026-10-08"), null);
});

test("penyimpanan rusak dan cart tidak valid ditangani tanpa crash", () => {
  assert.deepEqual(normalizeShopState(null, catalog), emptyShop());
  const state = normalizeShopState(
    {
      cart: [
        null,
        { id: 999 },
        { id: 1, size: "invalid", quantity: 1 },
        { id: 1, size: "30x40", quantity: 10 },
        { id: 1, size: "40x60", quantity: 2 },
      ],
      reviews: [null],
      orders: [null],
    },
    catalog,
  );
  assert.deepEqual(state.cart, [{ id: 1, size: "30x40", quantity: 3 }]);
  assert.deepEqual(state.reviews, []);
  assert.deepEqual(state.orders, []);
});

test("stok habis, duplikasi cart tersimpan, dan review tidak valid disaring", () => {
  const state = normalizeShopState(
    {
      stockUsed: { 1: 1 },
      cart: [
        { id: 1, size: "30x40", quantity: 1 },
        { id: 1, size: "30x40", quantity: 1 },
      ],
      reviews: [
        {
          id: "bad",
          paintingId: 1,
          name: "Tes",
          rating: 6,
          comment: "Tidak valid",
          date: "2026-10-08",
        },
      ],
    },
    catalog,
  );
  assert.equal(state.cart.length, 1);
  assert.equal(state.cart[0].quantity, 2);
  assert.equal(state.reviews.length, 0);
  assert.equal(
    normalizeShopState(
      { stockUsed: { 1: 999 }, cart: [{ id: 1, size: "30x40", quantity: 1 }] },
      catalog,
    ).cart.length,
    0,
  );
});

test("pesanan dan review valid tetap ada setelah simulasi refresh", () => {
  const state = addCartItem(emptyShop(), painting, "30x40", 1);
  const result = createOrder(
    state,
    catalog,
    "ART-TEST",
    "2026-10-08T00:00:00.000Z",
  );
  result.state.reviews.push({
    id: "review-test",
    paintingId: 1,
    name: "Tes",
    rating: 4,
    comment: "Karya menarik.",
    date: "2026-10-08T00:00:00.000Z",
  });
  const restored = normalizeShopState(
    JSON.parse(JSON.stringify(result.state)),
    catalog,
  );
  assert.equal(restored.orders[0].total, 275000);
  assert.equal(restored.reviews[0].rating, 4);
  assert.equal(availableStock(painting, restored), 2);
});
