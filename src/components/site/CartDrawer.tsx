import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove, subtotal, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg font-bold">
                Tu carrito <span className="text-muted-foreground">({count})</span>
              </h2>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
                  <ShoppingBag className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">Tu carrito está vacío</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Descubrí nuestros productos destacados.
                </p>
                <Link
                  to="/catalogo"
                  onClick={close}
                  className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand"
                >
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {items.map((it) => {
                    const price = it.product.salePrice ?? it.product.price;
                    return (
                      <div
                        key={it.product.id}
                        className="flex gap-3 rounded-xl border border-border p-3"
                      >
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug">
                              {it.product.name}
                            </p>
                            <button
                              onClick={() => remove(it.product.id)}
                              className="text-muted-foreground hover:text-brand"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-border">
                              <button
                                onClick={() => setQty(it.product.id, it.qty - 1)}
                                className="grid h-8 w-8 place-items-center"
                                aria-label="Restar"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {it.qty}
                              </span>
                              <button
                                onClick={() => setQty(it.product.id, it.qty + 1)}
                                className="grid h-8 w-8 place-items-center"
                                aria-label="Sumar"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold">
                              {formatPrice(price * it.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border bg-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    to="/carrito"
                    onClick={close}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground shadow-brand transition-transform hover:scale-[1.01]"
                  >
                    Finalizar pedido →
                  </Link>
                  <Link
                    to="/carrito"
                    onClick={close}
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-semibold hover:bg-secondary"
                  >
                    Ver carrito completo
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
