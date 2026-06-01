import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/catalogo", label: "Celulares", search: { cat: "Celulares" } },
  { to: "/catalogo", label: "Informática", search: { cat: "Informática" } },
  { to: "/catalogo", label: "Mecánica", search: { cat: "Mecánica" } },
  { to: "/contacto", label: "Contacto" },
];

export function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b border-border/60" : "bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-brand-foreground font-black">
            D
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            DONATELO<span className="text-brand">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n, i) => (
            <Link
              key={i}
              to={n.to}
              search={n.search as any}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
              activeProps={{ className: "text-brand" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/catalogo"
            className="hidden md:inline-grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={open}
            className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/90 hover:bg-secondary"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            className="ml-1 grid h-10 w-10 place-items-center rounded-full text-foreground/90 hover:bg-secondary md:hidden"
            aria-label="Menú"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 bg-background p-4">
              {nav.map((n, i) => (
                <Link
                  key={i}
                  to={n.to}
                  search={n.search as any}
                  onClick={() => setMenu(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
