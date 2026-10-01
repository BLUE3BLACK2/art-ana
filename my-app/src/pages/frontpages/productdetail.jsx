import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Detail Produk {id}</h1>
      <p className="mt-4">Ini adalah informasi detail untuk produk dengan ID: {id}</p>
    </div>
  );
}