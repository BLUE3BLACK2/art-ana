import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      <div className="flex flex-wrap justify-center gap-6">
        <Link to="/dashboard" className="hover:text-gray-200">
          Dashboard
        </Link>
        <Link to="/cart" className="hover:text-gray-200">
          Keranjang
        </Link>
        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>
      </div>
    </nav>
  );
}
