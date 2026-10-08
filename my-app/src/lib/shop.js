import { printSizes } from "../data/printoptions.js";

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
export const sizeLabel = (size) => `${size.replace("x", " × ")} cm`;
export const unitPrice = (painting, size) =>
  Math.round(
    (painting.price *
      (printSizes.find((option) => option.value === size)?.multiplier ?? 1)) /
      1000,
  ) * 1000;
export const shippingCost = (subtotal) =>
  subtotal === 0 || subtotal >= 500000 ? 0 : 25000;
export const cartKey = (id, size) => `${id}-${size}`;
export const emptyShop = () => ({
  cart: [],
  reviews: [],
  orders: [],
  stockUsed: {},
});

export function availableStock(painting, state) {
  return Math.max(0, painting.stock - (state.stockUsed[painting.id] || 0));
}

export function cartQuantity(cart, id) {
  return cart
    .filter((item) => item.id === id)
    .reduce((sum, item) => sum + item.quantity, 0);
}

// localStorage adalah input eksternal: cek bentuk data sebelum dipakai komponen.
export function normalizeShopState(value, catalog) {
  const state = emptyShop();
  if (!value || typeof value !== "object") return state;
  for (const painting of catalog) {
    const used = value.stockUsed?.[painting.id];
    if (Number.isInteger(used) && used > 0)
      state.stockUsed[painting.id] = Math.min(used, painting.stock);
  }
  if (Array.isArray(value.cart)) {
    for (const item of value.cart) {
      const painting = catalog.find((entry) => entry.id === item?.id);
      if (
        !painting ||
        !painting.sizes.includes(item.size) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      )
        continue;
      const remaining =
        availableStock(painting, state) - cartQuantity(state.cart, item.id);
      if (remaining < 1) continue;
      const existing = state.cart.find(
        (entry) =>
          cartKey(entry.id, entry.size) === cartKey(item.id, item.size),
      );
      const quantity = Math.min(item.quantity, remaining);
      if (existing) existing.quantity += quantity;
      else state.cart.push({ id: item.id, size: item.size, quantity });
    }
  }
  if (Array.isArray(value.reviews))
    state.reviews = value.reviews
      .filter(
        (review) =>
          review &&
          catalog.some((p) => p.id === review.paintingId) &&
          typeof review.id === "string" &&
          typeof review.name === "string" &&
          review.name.trim().length > 0 &&
          review.name.length <= 50 &&
          typeof review.comment === "string" &&
          review.comment.trim().length > 0 &&
          review.comment.length <= 1000 &&
          Number.isInteger(review.rating) &&
          review.rating >= 1 &&
          review.rating <= 5 &&
          typeof review.date === "string" &&
          Number.isFinite(Date.parse(review.date)),
      )
      .slice(0, 500);
  if (Array.isArray(value.orders))
    state.orders = value.orders
      .filter(
        (order) =>
          order &&
          typeof order.id === "string" &&
          typeof order.date === "string" &&
          Number.isFinite(Date.parse(order.date)) &&
          Array.isArray(order.items) &&
          order.items.length > 0 &&
          order.items.every(
            (item) =>
              item &&
              catalog.some(
                (p) => p.id === item.id && p.sizes.includes(item.size),
              ) &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              Number.isFinite(item.price) &&
              item.price > 0,
          ) &&
          Number.isFinite(order.total) &&
          Number.isFinite(order.shipping),
      )
      .slice(0, 50);
  return state;
}

export function addCartItem(state, painting, size, quantity) {
  if (
    !painting ||
    !painting.sizes.includes(size) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  )
    return state;
  if (
    quantity + cartQuantity(state.cart, painting.id) >
    availableStock(painting, state)
  )
    return state;
  const key = cartKey(painting.id, size);
  const found = state.cart.some((item) => cartKey(item.id, item.size) === key);
  const cart = found
    ? state.cart.map((item) =>
        cartKey(item.id, item.size) === key
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...state.cart, { id: painting.id, size, quantity }];
  return { ...state, cart };
}

export function createOrder(state, catalog, id, date) {
  if (!state.cart.length) return null;
  const items = [];
  const stockUsed = { ...state.stockUsed };
  for (const item of state.cart) {
    const painting = catalog.find((p) => p.id === item.id);
    if (
      !painting ||
      !painting.sizes.includes(item.size) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      cartQuantity(state.cart, item.id) > availableStock(painting, state)
    )
      return null;
    items.push({ ...item, price: unitPrice(painting, item.size) });
    stockUsed[item.id] = (stockUsed[item.id] || 0) + item.quantity;
  }
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingCost(subtotal);
  const order = { id, date, items, shipping, total: subtotal + shipping };
  return {
    order,
    state: {
      ...state,
      cart: [],
      stockUsed,
      orders: [order, ...state.orders].slice(0, 50),
    },
  };
}
