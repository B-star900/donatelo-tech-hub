import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/products";

interface SearchParams {
  cat?: string;
  q?: string;
  brand?: string;
  sort?: "recent" | "price-asc" | "price-desc" | "discount" | "rating";
}

export const Route = createFileRoute("/catalogo")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    cat: (s.cat as string) || undefined,
    q: (s.q as string) || undefined,
    brand: (s.brand as string) || undefined,
    sort: (s.sort as SearchParams["sort"]) || "recent",
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — DONATELO • CELULARES" },
      { name: "description", content: "Explorá todos nuestros productos premium." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground">{error.message}</div>
  ),
  component: Catalogo,
});

function Catalogo() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });
  const [showFilters, setShowFilters] = useState(false);
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.cat) list = list.filter((p) => p.category === search.cat);
    if (search.brand) list = list.filter((p) => p.brand === search.brand);
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    switch (search.sort) {
      case "price-asc":
        list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => {
          const da = a.salePrice ? 1 - a.salePrice / a.price : 0;
          const db = b.salePrice ? 1 - b.salePrice / b.price : 0;
          return db - da;
        });
        break;
    }
    return list;
  }, [products, search]);

  const setParam = (patch: Partial<SearchParams>) =>
    navigate({ search: (prev: SearchParams) => ({ ...prev, ...patch }) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Catálogo</p>
          <h1 className="mt-1 font-display text-4xl font-black md:text-5xl">
            {search.cat ?? "Todos los productos"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              defaultValue={search.q ?? ""}
              onChange={(e) => setParam({ q: e.target.value || undefined })}
              placeholder="Buscar..."
              className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-foreground/40 md:w-64"
            />
          </div>
          <select
            value={search.sort ?? "recent"}
            onChange={(e) => setParam({ sort: e.target.value as SearchParams["sort"] })}
            className="h-11 rounded-full border border-border bg-surface px-4 text-sm outline-none"
          >
            <option value="recent">Más recientes</option>
            <option value="rating">Mejor valorados</option>
            <option value="discount">Mayor descuento</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
          <FilterGroup label="Categoría">
            <FilterChip active={!search.cat} onClick={() => setParam({ cat: undefined })} label="Todas" />
            {categories.map((c) => (
              <FilterChip key={c.id} active={search.cat === c.nombre} onClick={() => setParam({ cat: c.nombre })} label={c.nombre} />
            ))}
          </FilterGroup>
          {brands.length > 0 && (
            <FilterGroup label="Marca">
              <FilterChip active={!search.brand} onClick={() => setParam({ brand: undefined })} label="Todas" />
              {brands.map((b) => (
                <FilterChip key={b} active={search.brand === b} onClick={() => setParam({ brand: b })} label={b} />
              ))}
            </FilterGroup>
          )}
        </aside>

        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
            <p className="text-lg font-semibold">No encontramos resultados</p>
            <p className="mt-1 text-sm text-muted-foreground">Probá quitando algún filtro.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-border bg-background text-foreground/70 hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}
