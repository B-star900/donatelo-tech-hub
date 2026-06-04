import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Zap, BadgeCheck } from "lucide-react";
import heroImg from "@/assets/hero-phone.jpg";
import { productsQuery, categoriesQuery } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DONATELO • CELULARES — Tecnología premium" },
      {
        name: "description",
        content:
          "Celulares, informática y mecánica premium con envío rápido y atención por WhatsApp.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]);
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const trending = products.slice(0, 4);
  const offers = products.filter((p) => p.salePrice).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-70">
          <img src={heroImg} alt="Smartphone premium" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center px-4 py-20 md:px-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Nueva colección · 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-balance md:text-7xl lg:text-8xl"
            >
              Tecnología que
              <span className="block text-brand">no se conforma.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-base text-white/70 md:text-lg"
            >
              Celulares, informática y herramientas profesionales. Las marcas que querés, al precio que merecés.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/catalogo"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-brand-foreground shadow-brand transition-transform hover:scale-[1.02]"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/60">
              {[
                { icon: ShieldCheck, label: "Garantía oficial" },
                { icon: Truck, label: "Envío 24/48 hs" },
                { icon: BadgeCheck, label: "Productos originales" },
                { icon: Zap, label: "Soporte por WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-brand" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <SectionHeader eyebrow="Explorar" title="Categorías" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {categories.slice(0, 3).map((c, i) => {
              const sample = products.find((p) => p.categorySlug === c.slug);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to="/catalogo"
                    search={{ cat: c.nombre } as never}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-ink"
                  >
                    {sample && (
                      <img
                        src={sample.image}
                        alt={c.nombre}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-xs uppercase tracking-widest text-brand">Categoría</p>
                      <h3 className="mt-1 font-display text-3xl font-bold">{c.nombre}</h3>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                        Explorar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h2 className="font-display text-3xl font-bold">Catálogo en preparación</h2>
          <p className="mt-3 text-muted-foreground">
            Estamos cargando nuevos productos. Vuelve pronto.
          </p>
        </section>
      )}

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <SectionHeader eyebrow="Destacados" title="Lo más pedido del momento" link={{ to: "/catalogo", label: "Ver todo" }} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}


      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionHeader eyebrow="Catálogo" title="Lo último que sumamos" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-black md:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link to={link.to as never} className="hidden text-sm font-semibold text-foreground/80 hover:text-brand md:inline-flex">
          {link.label} →
        </Link>
      )}
    </div>
  );
}
