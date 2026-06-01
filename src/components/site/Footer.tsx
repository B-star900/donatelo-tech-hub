import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand font-black">
                D
              </span>
              <span className="font-display text-lg font-bold">
                DONATELO<span className="text-brand">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Tecnología premium, celulares, informática y herramientas mecánicas. Vendemos lo que
              usamos. Garantía real.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:bg-brand hover:border-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
              Tienda
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/catalogo" search={{ cat: "Celulares" } as any}>Celulares</Link></li>
              <li><Link to="/catalogo" search={{ cat: "Informática" } as any}>Informática</Link></li>
              <li><Link to="/catalogo" search={{ cat: "Mecánica" } as any}>Mecánica</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
              Ayuda
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/contacto">Contacto</Link></li>
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Garantía</a></li>
              <li><a href="#">Términos</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} DONATELO · CELULARES. Todos los derechos reservados.</p>
          <p>Hecho con tecnología latina 🔥</p>
        </div>
      </div>
    </footer>
  );
}
