import Link from "next/link";
import { bn } from "@/lib/helpers";
import Badge from "./Badge";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
    >
      <div className="text-4xl">{product.emoji}</div>
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.unit}</p>
      <div className="flex justify-between items-center mt-3">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="font-bold">{bn(product.price)} টাকা</p>
        </div>
        <Badge change={product.change} />
      </div>
    </Link>
  );
}