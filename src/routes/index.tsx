import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Zap, BadgeCheck } from "lucide-react";
import heroImg from "@/assets/hero-phone.jpg";
import { products, categories } from "@/lib/products";
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
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const trending = products.filter((p) => p.trending);
  const offers = products.filter((p) => p.salePrice).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-70">
          <img
            src={heroImg}
            alt="Smartphone premium"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
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
              Nueva colección · Otoño 2026
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
              Celulares, informática y herramientas profesionales. Las marcas que querés, al precio
              que merecés.
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
              <Link
                to="/catalogo"
                search={{ cat: "Celulares" } as any}
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold backdrop-blur hover:bg-white/10"
              >
                Celulares
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
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeader eyebrow="Explorar" title="Categorías" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((c, i) => {
            const sample = products.find((p) => p.category === c)!;
            return (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to="/catalogo"
                  search={{ cat: c } as any}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-ink"
                >
                  <img
                    src={sample.image}
                    alt={c}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs uppercase tracking-widest text-brand">Categoría</p>
                    <h3 className="mt-1 font-display text-3xl font-bold">{c}</h3>
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

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionHeader
          eyebrow="Destacados"
          title="Lo más pedido del momento"
          link={{ to: "/catalogo", label: "Ver todo" }}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 text-white md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-black/30 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Oferta limitada
              </p>
              <h2 className="mt-3 font-display text-4xl font-black leading-tight md:text-5xl">
                Hasta <span className="text-white">30% OFF</span> en celulares seleccionados.
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                Pagás menos, recibís en 24 hs y tenés garantía real. Mientras dure el stock.
              </p>
              <Link
                to="/catalogo"
                search={{ sort: "discount" } as any}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Ver ofertas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block" />
          </div>
        </motion.div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionHeader eyebrow="Trending" title="Lo que está sonando" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* OFFERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionHeader eyebrow="Ofertas" title="Promos del día" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-border bg-surface px-6 py-10">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trabajamos con las mejores marcas
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-6 text-center font-display text-2xl font-bold text-foreground/80 sm:grid-cols-3 md:grid-cols-6">
            {["Apple", "Samsung", "Xiaomi", "Logitech", "Keychron", "Stanley"].map((b) => (
              <span key={b} className="opacity-70 transition-opacity hover:opacity-100">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionHeader eyebrow="Clientes" title="Confianza real" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              q: "Compré mi iPhone y llegó al día siguiente. Atención de primera por WhatsApp.",
              n: "Lucía R.",
            },
            {
              q: "Precios imbatibles y producto 100% original. Ya soy cliente fijo.",
              n: "Martín G.",
            },
            {
              q: "El asesoramiento fue clave. Me ayudaron a elegir la laptop perfecta.",
              n: "Camila P.",
            },
          ].map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="text-brand">★★★★★</div>
              <blockquote className="mt-3 text-foreground/90">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">
                — {t.n}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
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
        <Link
          to={link.to as any}
          className="hidden text-sm font-semibold text-foreground/80 hover:text-brand md:inline-flex"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
