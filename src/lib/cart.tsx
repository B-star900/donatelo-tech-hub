import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Saneamos: descartamos items con producto inválido o qty no numérica.
          const safe = parsed.filter(
            (it: unknown): it is CartItem =>
              !!it &&
              typeof it === "object" &&
              "product" in it &&
              !!(it as CartItem).product?.id &&
              typeof (it as CartItem).qty === "number" &&
              (it as CartItem).qty > 0,
          );
          setItems(safe);
        }
      }
    } catch (e) {
      console.warn("[cart] no se pudo leer el carrito local:", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[cart] no se pudo guardar el carrito local:", e);
    }
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
              c.product.id === product.id
                ? { ...c, qty: Math.min(c.qty + qty, product.stock) }
                : c,
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

// Número de WhatsApp del negocio (formato internacional, sin + ni espacios).
export const WHATSAPP_NUMBER = "5354633440";

export interface CheckoutData {
  items: CartItem[];
  total: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notas?: string;
}

export function buildWhatsAppText(opts: CheckoutData) {
  const lines = [
    "*Nuevo pedido — DONATELO • CELULARES*",
    "",
    ...opts.items.map(
      (i) =>
        `• ${i.qty}× ${i.product.name} — $${((i.product.salePrice ?? i.product.price) * i.qty).toLocaleString("es-AR")}`,
    ),
    "",
    `*Total:* $${opts.total.toLocaleString("es-AR")}`,
    `*Cliente:* ${opts.name}`,
    `*Tel:* ${opts.phone}`,
  ];
  if (opts.email) lines.push(`*Email:* ${opts.email}`);
  if (opts.address) lines.push(`*Dirección:* ${opts.address}`);
  if (opts.notas) lines.push(`*Notas:* ${opts.notas}`);
  return lines.join("\n");
}

export function buildWhatsAppUrl(opts: CheckoutData) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppText(opts))}`;
}

/** Persists order to database, returns row or null. */
export async function createOrder(opts: CheckoutData) {
  const payload = {
    cliente_nombre: opts.name,
    cliente_telefono: opts.phone,
    cliente_email: opts.email || null,
    cliente_direccion: opts.address || null,
    notas: opts.notas || null,
    items: opts.items.map((i) => ({
      slug: i.product.id,
      nombre: i.product.name,
      qty: i.qty,
      precio: i.product.salePrice ?? i.product.price,
    })),
    total: opts.total,
  };
  const { error } = await supabase.from("pedidos").insert(payload);
  if (error) throw error;
  return payload;
}
