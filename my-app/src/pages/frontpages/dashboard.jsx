import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div key={id} className="border rounded-lg p-4 shadow hover:shadow-lg">
            <h2 className="font-semibold">Produk {id}</h2>
            <p className="text-gray-600">Deskripsi singkat produk {id}</p>
            <Link
              to={`/product/${id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              Lihat Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}