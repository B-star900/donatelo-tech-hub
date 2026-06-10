import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, Star, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPrice, productQuery, productsQuery } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/producto/$id")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.id));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery);
  },
  head: () => ({ meta: [{ title: "Producto — DONATELO" }] }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p>{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Producto no encontrado</h1>
      <Link to="/catalogo" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white">
        Ver catálogo
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(id));
  const { data: all } = useSuspenseQuery(productsQuery);
  const { add, open } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  if (!product) return null;

  const onSale = product.salePrice && product.salePrice < product.price;
  const price = product.salePrice ?? product.price;
  const discount = onSale
    ? Math.round((1 - (product.salePrice as number) / product.price) * 100)
    : 0;
  const images = product.images.length ? product.images : [product.image];
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Inicio</Link> /{" "}
        <Link to="/catalogo" search={{ cat: product.category } as never} className="hover:text-foreground">
          {product.category || "Catálogo"}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-surface"
          >
            {onSale && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase text-brand-foreground">
                -{discount}%
              </span>
            )}
            <img
              src={images[activeImg] ?? images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                    activeImg === i ? "border-brand" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl font-black leading-tight md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-brand text-brand" /> {product.rating}
            </span>
            <span className="text-muted-foreground">{product.reviews} reseñas</span>
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                product.stock > 0 ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
              }`}
            >
              {product.stock > 0 ? `En stock · ${product.stock}` : "Agotado"}
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-black">{formatPrice(price)}</span>
            {onSale && (
              <span className="pb-1 text-base text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Color: <span className="text-foreground">{activeColor ?? "Elegí uno"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.nombre}
                    onClick={() => setActiveColor(c.nombre)}
                    title={c.nombre}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      activeColor === c.nombre ? "border-brand ring-2 ring-brand/30" : "border-border"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}


          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center" aria-label="Restar">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-11 w-11 place-items-center" aria-label="Sumar">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              disabled={product.stock === 0}
              onClick={() => {
                add(product, qty);
                toast.success("Agregado al carrito", { description: product.name });
                open();
              }}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-brand-foreground shadow-brand transition-transform hover:scale-[1.01] disabled:opacity-40"
            >
              Agregar al carrito
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-surface p-4 text-sm sm:grid-cols-3">
            {[
              { icon: Truck, label: "Envío 24/48 hs" },
              { icon: ShieldCheck, label: "Garantía oficial" },
              { icon: Zap, label: "Pago seguro" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand" /> {label}
              </div>
            ))}
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold">Descripción</h2>
              <p className="mt-2 whitespace-pre-line text-foreground/80">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-black md:text-3xl">También te puede gustar</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
