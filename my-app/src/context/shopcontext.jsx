import { useEffect, useState } from "react";
import { ShopContext } from "./shop";
import {
  loadWorkspace,
  validDemoLogin,
  saveArtwork,
  deleteArtwork,
  changeOrderStatus,
  moderateReview,
} from "../lib/admin";
import {
  addCartItem,
  availableStock,
  cartKey,
  cartQuantity,
  createOrder,
  shippingCost,
  unitPrice,
} from "../lib/shop";

const STORAGE_KEY = "art-ana-shop-v1";

function loadShop() {
  try {
    return loadWorkspace(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return loadWorkspace(null);
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem("art-ana-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* Tema tetap dapat digunakan ketika penyimpanan browser diblokir. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Context membagikan keranjang, ulasan, stok simulasi, dan tema ke semua halaman.
export function ShopProvider({ children }) {
  const [state, setState] = useState(loadShop);
  const paintings = state.catalog;
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem("art-ana-demo-admin") === "signed-in";
    } catch {
      return false;
    }
  });
  const [theme, setTheme] = useState(loadTheme);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    function syncBrowserTabs(event) {
      if (event.key === STORAGE_KEY) {
        try {
          const next = loadWorkspace(JSON.parse(event.newValue));
          setState((previous) =>
            JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
          );
        } catch {
          /* Ignore incomplete or corrupted external writes. */
        }
      }
      if (
        event.key === "art-ana-theme" &&
        ["light", "dark"].includes(event.newValue)
      )
        setTheme(event.newValue);
    }
    window.addEventListener("storage", syncBrowserTabs);
    return () => window.removeEventListener("storage", syncBrowserTabs);
  }, []);

  useEffect(() => {
    // Status ini berasal dari kegagalan sistem penyimpanan eksternal, bukan data turunan render.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // oxlint-disable-next-line react/set-state-in-effect
      setStorageError(false);
    } catch {
      // oxlint-disable-next-line react/set-state-in-effect
      setStorageError(true);
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("art-ana-theme", theme);
    } catch {
      /* Tema berlaku untuk sesi ini. */
    }
  }, [theme]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const cartItems = state.cart.map((item) => {
    const painting = paintings.find((p) => p.id === item.id);
    return {
      ...item,
      painting,
      key: cartKey(item.id, item.size),
      price: unitPrice(painting, item.size),
    };
  });
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingCost(subtotal);

  function addToCart(id, size = "30x40", quantity = 1) {
    const painting = paintings.find((p) => p.id === id);
    const next = addCartItem(state, painting, size, quantity);
    if (next === state) {
      setNotice("The requested quantity exceeds available stock.");
      return false;
    }
    setState(next);
    setNotice(`${painting.title} added to your cart.`);
    return true;
  }

  function updateQuantity(key, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const item = state.cart.find(
      (entry) => cartKey(entry.id, entry.size) === key,
    );
    if (!item) return;
    const painting = paintings.find((p) => p.id === item.id);
    if (
      cartQuantity(state.cart, item.id) - item.quantity + quantity >
      availableStock(painting, state)
    ) {
      setNotice("There is not enough stock to increase the quantity.");
      return;
    }
    setState((previous) => ({
      ...previous,
      cart: previous.cart.map((entry) =>
        cartKey(entry.id, entry.size) === key ? { ...entry, quantity } : entry,
      ),
    }));
  }

  function removeFromCart(key) {
    setState((previous) => ({
      ...previous,
      cart: previous.cart.filter((item) => cartKey(item.id, item.size) !== key),
    }));
    setNotice("Artwork removed from your cart.");
  }

  function addReview(paintingId, { name, rating, comment }) {
    if (
      !paintings.some((p) => p.id === paintingId) ||
      !name.trim() ||
      name.trim().length > 50 ||
      !comment.trim() ||
      comment.trim().length > 1000 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    )
      return false;
    const review = {
      id: crypto.randomUUID(),
      paintingId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      reviews: [review, ...previous.reviews].slice(0, 500),
    }));
    setNotice("Thank you! Your review has been saved in this browser.");
    return true;
  }

  function placeOrder() {
    const result = createOrder(
      state,
      paintings,
      `ART-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      new Date().toISOString(),
    );
    if (!result) {
      setNotice("Please check your cart and available stock before checkout.");
      return null;
    }
    setState(result.state);
    return result.order;
  }

  function ratingFor(id) {
    const reviews = state.reviews.filter(
      (review) => review.paintingId === id && !review.hidden,
    );
    return {
      count: reviews.length,
      average: reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0,
    };
  }

  return (
    <ShopContext.Provider
      value={{
        paintings,
        isAdmin,
        loginAdmin: (username, password) => {
          if (!validDemoLogin(username, password)) return false;
          setIsAdmin(true);
          try {
            sessionStorage.setItem("art-ana-demo-admin", "signed-in");
          } catch {
            /* Session only. */
          }
          return true;
        },
        logoutAdmin: () => {
          setIsAdmin(false);
          try {
            sessionStorage.removeItem("art-ana-demo-admin");
          } catch {
            /* Session only. */
          }
        },
        saveArtwork: (draft, id) => {
          if (!isAdmin) return false;
          const next = saveArtwork(state, draft, id);
          if (!next) return false;
          setState(next);
          setNotice(id ? "Artwork updated." : "Artwork added to the gallery.");
          return true;
        },
        deleteArtwork: (id) => {
          if (!isAdmin) return;
          setState((previous) => deleteArtwork(previous, id));
          setNotice("Artwork deleted. Existing order records have been kept.");
        },
        changeOrderStatus: (id, status) => {
          if (!isAdmin) return;
          setState((previous) => changeOrderStatus(previous, id, status));
          setNotice("Order status updated. Stock is unchanged.");
        },
        moderateReview: (id, action) => {
          if (!isAdmin) return;
          setState((previous) => moderateReview(previous, id, action));
          setNotice(
            action === "delete"
              ? "Review deleted."
              : "Review visibility updated.",
          );
        },
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === "light" ? "dark" : "light")),
        cartItems,
        cartCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        shipping,
        total: subtotal + shipping,
        addToCart,
        updateQuantity,
        removeFromCart,
        addReview,
        placeOrder,
        ratingFor,
        reviews: state.reviews,
        orders: state.orders,
        stockFor: (id) =>
          availableStock(
            paintings.find((p) => p.id === id),
            state,
          ),
        inCart: (id) => cartQuantity(state.cart, id),
      }}
    >
      {children}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {storageError && (
        <div className="storage-warning" role="alert">
          Browser storage is unavailable. Changes will last only while this page
          is open.
        </div>
      )}
    </ShopContext.Provider>
  );
}
