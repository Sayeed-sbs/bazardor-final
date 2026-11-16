
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getProduct } from "@/lib/api";
import { bn } from "@/lib/helpers";
import NotFoundBox from "@/components/NotFoundBox";

function PriceChange({ change }) {
  if (change > 0) {
    return (
      <span className="text-xs font-semibold text-red-500">
        ▲ {bn(change)}%
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="text-xs font-semibold text-green-600">
        ▼ {bn(Math.abs(change))}%
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold text-gray-500">
      — ০.০%
    </span>
  );
}

function PriceBox({ title, price, description, color }) {
  return (
    <div className="rounded-xl border border-[#e1e9e3] bg-white p-4">
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <h3 className={`mt-2 text-2xl font-bold ${color}`}>
        {bn(price)}
        <span className="ml-1 text-sm font-normal">
          টাকা
        </span>
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPending || session) return;

    toast.error("বিস্তারিত দেখতে আগে সাইন ইন করুন");
    router.replace("/signin");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session || !slug) return;

    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError(false);
      setProduct(null);

      try {
        const data = await getProduct(slug);
        if (active) setProduct(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug, session?.user?.id]);

  if (isPending || !session || loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 py-5">
        <div className="skeleton h-5 w-48" />
        <div className="skeleton h-32 w-full rounded-2xl" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">
          পণ্যের তথ্য লোড করা যাচ্ছে না।
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

  if (!product) {
    return <NotFoundBox />;
  }

  const markets = product.markets || [];

  const validMarkets = markets.filter(
    (market) =>
      Number.isFinite(market.min) &&
      Number.isFinite(market.max) &&
      market.min > 0 &&
      market.max > 0
  );

  const minPrice = validMarkets.length
    ? Math.min(...validMarkets.map((market) => market.min))
    : product.price;

  const maxPrice = validMarkets.length
    ? Math.max(...validMarkets.map((market) => market.max))
    : product.price;

  const averagePrice = validMarkets.length
    ? validMarkets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0
      ) / validMarkets.length
    : product.price;

  const difference = Math.abs(
    product.price - product.yesterday
  );

  let summary = "গতকালের তুলনায় আজকের দাম অপরিবর্তিত";

  if (product.change > 0) {
    summary = `গতকালের তুলনায় আজ দাম বেড়েছে · ${bn(difference)} টাকা`;
  } else if (product.change < 0) {
    summary = `গতকালের তুলনায় আজ দাম কমেছে · ${bn(difference)} টাকা`;
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#078945]">
          হোম
        </Link>

        <span>›</span>

        <span>{product.categoryName}</span>

        <span>›</span>

        <span className="text-[#202a22]">
          {product.name}
        </span>
      </nav>

      <section className="flex flex-col gap-4 rounded-2xl border border-[#e1e9e3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f2f6f2] text-4xl">
            {product.emoji || "🛒"}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#202a22] sm:text-2xl">
              {product.name}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {product.unit}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {summary}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#f2f6f2] px-5 py-3 text-center sm:min-w-28">
          <p className="text-xs text-gray-500">
            আজকের দাম
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#202a22]">
            {bn(product.price)}
          </h2>

          <p className="text-xs text-gray-500">
            টাকা / {product.unitShort}
          </p>

          <div className="mt-1">
            <PriceChange change={product.change} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-[#e1e9e3] bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-bold text-[#202a22]">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <PriceBox
            title="সর্বনিম্ন দাম"
            price={minPrice}
            description="সবচেয়ে কম বাজারের দাম"
            color="text-[#078945]"
          />

          <PriceBox
            title="সর্বোচ্চ দাম"
            price={maxPrice}
            description="সবচেয়ে বেশি বাজারের দাম"
            color="text-red-500"
          />

          <PriceBox
            title="গড় দাম"
            price={averagePrice}
            description="প্রতি বাজারের গড়"
            color="text-[#078945]"
          />
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold text-[#202a22]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <div className="rounded-lg bg-[#f2f6f2] p-6 text-center text-sm text-gray-500">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e1e9e3]">
            <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm">
              <thead className="bg-[#f5f8f5] text-gray-500">
                <tr>
                  <th className="px-3 py-3 font-medium">
                    বাজার
                  </th>

                  <th className="px-3 py-3 font-medium">
                    বিভাগ
                  </th>

                  <th className="px-3 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>

                  <th className="px-3 py-3 text-right font-medium">
                    সর্বোচ্চ
                  </th>

                  <th className="px-3 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => {
                  const marketAverage =
                    (market.min + market.max) / 2;

                  return (
                    <tr
                      key={`${market.name}-${index}`}
                      className={`border-t border-[#e1e9e3] ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-[#f2f6f2]"
                      }`}
                    >
                      <td className="px-3 py-3 font-medium text-[#202a22]">
                        {market.name}
                      </td>

                      <td className="px-3 py-3 text-gray-600">
                        {market.division}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-right text-gray-600">
                        {bn(market.min)} টাকা
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-right text-gray-600">
                        {bn(market.max)} টাকা
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#202a22]">
                        {bn(marketAverage)} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
