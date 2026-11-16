
"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { bn } from "@/lib/helpers";
import ProductCard from "@/components/ProductCard";
import CardSkeleton from "@/components/CardSkeleton";

function ProductSection({ heading, items, loading, id, subtitle, arrow }) {
  return (
    <section id={id} className="mt-9 scroll-mt-6 sm:mt-11">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-ink">
          {arrow && (
            <span className={`mr-1 ${arrow === "up" ? "text-down" : "text-brand"}`}>
              {arrow === "up" ? "▲" : "▼"}
            </span>
          )}
          {heading}
        </h2>

        {subtitle && (
          <p className="mt-2 text-base text-gray-500 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    getProducts()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const risers = products
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = products
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <div>
      <section className="flex flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-[#e1ebe3] bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-5 sm:py-3">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center rounded-full bg-[#e9f7ef] px-3 py-1 text-xs font-medium text-[#188e4b]">
            {date || "আজকের বাজার দর"}
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-snug text-ink sm:text-[27px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 max-w-[470px] text-sm leading-relaxed text-gray-500">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন, সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-[#098b49] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08763e]"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="flex shrink-0 items-center justify-center sm:w-44 md:w-52">
          <img
            src="/bazar-hero.png"
            alt="ফল ও সবজির ঝুড়ি"
            className="h-36 w-44 object-contain sm:h-40 sm:w-44 md:h-44 md:w-52"
          />
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-white p-5 text-down"
        >
          দুঃখিত, বাজারের তথ্য লোড করা যায়নি।
          পেজটি আবার খুলে দেখুন।
        </p>
      )}

      <ProductSection
        heading="আজ দাম বেড়েছে"
        arrow="up"
        items={risers}
        loading={loading}
      />

      <ProductSection
        heading="আজ দাম কমেছে"
        arrow="down"
        items={fallers}
        loading={loading}
      />

      <ProductSection
        id="সব-পণ্য"
        heading="সব পণ্য"
        subtitle={
          loading
            ? "পণ্য লোড হচ্ছে..."
            : `মোট ${bn(products.length)}টি পণ্য দেখানো হচ্ছে`
        }
        items={products}
        loading={loading}
      />
    </div>
  );
}
