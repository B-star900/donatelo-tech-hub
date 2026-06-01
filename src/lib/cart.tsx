import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "donatelo:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce(
      (s, i) => s + (i.product.salePrice ?? i.product.price) * i.qty,
      0,
    );
    return {
      items,
      count,
      subtotal,
      add: (product, qty = 1) =>
        setItems((curr) => {
          const ex = curr.find((c) => c.product.id === product.id);
          if (ex)
            return curr.map((c) =>
              c.product.id === product.id ? { ...c, qty: Math.min(c.qty + qty, product.stock) } : c,
            );
          return [...curr, { product, qty: Math.min(qty, product.stock) }];
        }),
      remove: (id) => setItems((c) => c.filter((i) => i.product.id !== id)),
      setQty: (id, qty) =>
        setItems((c) =>
          c
            .map((i) =>
              i.product.id === id ? { ...i, qty: Math.max(0, Math.min(qty, i.product.stock)) } : i,
            )
            .filter((i) => i.qty > 0),
        ),
      clear: () => setItems([]),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((o) => !o),
    };
  }, [items, isOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

// Update with the business WhatsApp number (international format, no + or spaces).
export const WHATSAPP_NUMBER = "5491100000000";

export function buildWhatsAppUrl(opts: {
  items: CartItem[];
  total: number;
  name?: string;
  address?: string;
  payment?: string;
}) {
  const lines = [
    "*Nuevo pedido — DONATELO • CELULARES*",
    "",
    ...opts.items.map(
      (i) =>
        `• ${i.qty}× ${i.product.name} — $${((i.product.salePrice ?? i.product.price) * i.qty).toLocaleString("es-AR")}`,
    ),
    "",
    `*Total:* $${opts.total.toLocaleString("es-AR")}`,
  ];
  if (opts.name) lines.push(`*Cliente:* ${opts.name}`);
  if (opts.address) lines.push(`*Dirección:* ${opts.address}`);
  if (opts.payment) lines.push(`*Pago:* ${opts.payment}`);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
