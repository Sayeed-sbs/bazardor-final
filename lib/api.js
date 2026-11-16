import { BASE, getList, fixProduct, fixCategory } from "./helpers";

async function fetchData(path) {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) throw new Error("বাজারের তথ্য লোড করা যায়নি");
  return response.json();
}

export async function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const json = await fetchData(`/products${query}`);
  return getList(json).map(fixProduct);
}

export async function getProduct(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || String(p.id) === slug) || null;
}

export async function getCategories() {
  const json = await fetchData("/categories");
  return getList(json).map(fixCategory);
}

export async function getCategory(slug) {
  const json = await fetchData(`/categories/${encodeURIComponent(slug)}`);
  return fixCategory(json.data || json);
}
