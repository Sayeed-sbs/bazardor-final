
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProducts, getCategory } from "@/lib/api";
import { bn } from "@/lib/helpers";
import NotFoundBox from "@/components/NotFoundBox";
import CardSkeleton from "@/components/CardSkeleton";

function PriceChange({ change }) {
  if (change > 0) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-500">
        ▲ {bn(change)}%
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
        ▼ {bn(Math.abs(change))}%
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
      — ০.০%
    </span>
  );
}

function CategoryCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-[#e0e8e2] bg-white p-4 transition hover:border-[#b5d7c1] hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f6f2] text-2xl">
          {product.emoji}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-[#202a22]">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">
            আজকের দাম
          </p>
          <p className="mt-1 text-lg font-bold text-[#202a22]">
            {bn(product.price)}
            <span className="ml-1 text-sm font-normal">
              টাকা
            </span>
          </p>
        </div>

        <PriceChange change={product.change} />
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    setProducts([]);
    setCategory(null);
    setSort("default");

    Promise.all([getProducts(slug), getCategory(slug)])
      .then(([items, info]) => {
        if (!active) return;
        setProducts(items);
        setCategory(info);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (!loading && error) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">
          বাজারের তথ্য এখন দেখানো যাচ্ছে না।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#078945] px-5 py-2 text-sm text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (!loading && (!category?.name || products.length === 0)) {
    return <NotFoundBox />;
  }

  return (
    <div className="mx-auto w-full">
      <div className="flex items-center gap-3 rounded-2xl border border-[#e0e8e2] bg-white px-5 py-5">
        <span className="text-3xl">
          {category?.icon || "🛒"}
        </span>

        <div>
          <h1 className="text-xl font-bold text-[#202a22]">
            {category?.name || "পণ্য"}
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            {loading
              ? "পণ্য লোড হচ্ছে..."
              : `${bn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-14 items-center justify-end rounded-2xl border border-[#e0e8e2] bg-white px-5">
        <div className="flex items-center gap-3">
          <label htmlFor="category-sort" className="text-sm text-gray-500">
            সাজান
          </label>

          <select
            id="category-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-[#dce6df] bg-white px-3 py-2 text-sm text-[#202a22] outline-none focus:border-[#078945]"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <p className="mb-3 mt-4 text-sm text-gray-500">
        {loading
          ? "পণ্য লোড হচ্ছে..."
          : `মোট ${bn(products.length)}টি পণ্য দেখানো হচ্ছে`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-36 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <CategoryCard
              key={product.slug}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
