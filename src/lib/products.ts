import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["productos"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categorias"]["Row"];

export interface Product {
  /** Slug — used as URL id and cart key. */
  id: string;
  /** Database UUID, only used by admin. */
  dbId: string;
  name: string;
  brand: string;
  category: string;
  categorySlug?: string;
  price: number;
  salePrice?: number;
  shortDesc: string;
  description: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  trending?: boolean;
  featured?: boolean;
}

type Row = ProductRow & { categorias?: { nombre: string; slug: string } | null };

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1512499617640-c2f999098c01?w=800&q=80";

export function mapProduct(row: Row): Product {
  const onSale = row.en_oferta && row.precio_original != null;
  const basePrice = onSale ? Number(row.precio_original) : Number(row.precio);
  const sale = onSale ? Number(row.precio) : undefined;
  const galeria = Array.isArray(row.galeria)
    ? (row.galeria as unknown[]).filter((g): g is string => typeof g === "string")
    : [];
  return {
    id: row.slug,
    dbId: row.id,
    name: row.nombre,
    brand: row.marca ?? "",
    category: row.categorias?.nombre ?? "",
    categorySlug: row.categorias?.slug,
    price: basePrice,
    salePrice: sale,
    shortDesc: (row.descripcion ?? "").split("\n")[0]?.slice(0, 140) ?? "",
    description: row.descripcion ?? "",
    image: row.imagen_url || galeria[0] || FALLBACK_IMG,
    images: galeria.length ? galeria : [row.imagen_url || FALLBACK_IMG],
    stock: row.stock,
    rating: Number(row.rating),
    reviews: row.reviews_count,
    tags: [
      ...(row.destacado ? ["destacado"] : []),
      ...(row.en_oferta ? ["oferta"] : []),
    ],
    trending: row.destacado,
    featured: row.destacado,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(nombre, slug)")
    .eq("activo", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(nombre, slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export const productsQuery = queryOptions({
  queryKey: ["productos"],
  queryFn: fetchProducts,
});

export const categoriesQuery = queryOptions({
  queryKey: ["categorias"],
  queryFn: fetchCategories,
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["producto", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
