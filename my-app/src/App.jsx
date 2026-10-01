import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/mainlayout";
import Dashboard from "./pages/frontpages/dashboard";
import ProductDetail from "./pages/frontpages/productdetail";
import Cart from "./pages/frontpages/cart";
import Checkout from "./pages/frontpages/checkout";

import AdminLayout from "./layouts/adminlayout";
import AdminDashboard from "./pages/adminpages/admindahsboard";
import AboutPage from "./pages/adminpages/aboutpage";

export default function App() {
  return (
    <Routes>
      {/* Frontpage Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
