"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { bn } from "@/lib/helpers";
import Badge from "./Badge";

export default function Ticker() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  const items = [...products, ...products];

  return (
    <div className="bg-ink text-white overflow-hidden py-2 text-sm">
      <div className="ticker-track">
        {items.map((p, i) => (
          <span key={i} className="mx-6 whitespace-nowrap">
           {p.emoji} {p.name} {bn(p.price)} টাকা/{p.unitShort} <Badge change={p.change} />
          </span>
        ))}
      </div>
    </div>
  );
}