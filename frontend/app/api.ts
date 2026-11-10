// MedTracker API client — calls Render FastAPI backend
// Falls back gracefully if the backend is sleeping (Render free tier)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://medtracker-kjzr.onrender.com";

export interface ApiPriceEntry {
  site: string;
  price: number;
  mrp: number;
  link: string;
  in_stock: boolean;
  delivery: string;
  color: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  tag?: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  prices: ApiPriceEntry[];
}

export interface ApiCategory {
  category: string;
  count: number;
}

// Convert API response to the shape page.tsx already uses
export function toProduct(p: ApiProduct) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    image: p.image,
    tag: p.tag,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
    highlights: p.highlights ?? [],
    prices: (p.prices ?? []).map((pr) => ({
      site: pr.site,
      price: pr.price,
      mrp: pr.mrp,
      link: pr.link,
      inStock: pr.in_stock,
      delivery: pr.delivery,
      color: pr.color,
    })),
  };
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 300 }, // cache 5 min in Next.js
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchProducts(category?: string, limit = 40, offset = 0) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (category) params.set("category", category);
  const data = await apiFetch<ApiProduct[]>(`/products?${params}`);
  return data ? data.map(toProduct) : null;
}

export async function fetchProduct(id: string) {
  const data = await apiFetch<ApiProduct>(`/products/${id}`);
  return data ? toProduct(data) : null;
}

export async function searchProducts(q: string) {
  const data = await apiFetch<ApiProduct[]>(`/search?q=${encodeURIComponent(q)}`);
  return data ? data.map(toProduct) : null;
}

export async function fetchCategories() {
  return apiFetch<ApiCategory[]>("/categories");
}
