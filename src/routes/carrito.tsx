import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { buildWhatsAppUrl, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/carrito")({
  head: () => ({ meta: [{ title: "Carrito — DONATELO" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Efectivo");

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-black">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Sumá algún producto para continuar.</p>
        <Link
          to="/catalogo"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-bold text-white hover:bg-brand"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  const waUrl = buildWhatsAppUrl({
    items,
    total: subtotal,
    name: name || undefined,
    address: address || undefined,
    payment,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-black md:text-5xl">Tu carrito</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {items.map((it) => {
            const price = it.product.salePrice ?? it.product.price;
            return (
              <div key={it.product.id} className="flex gap-4 rounded-2xl border border-border p-4">
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {it.product.brand}
                      </p>
                      <Link
                        to="/producto/$id"
                        params={{ id: it.product.id }}
                        className="font-semibold hover:text-brand"
                      >
                        {it.product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => remove(it.product.id)}
                      className="text-muted-foreground hover:text-brand"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQty(it.product.id, it.qty - 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.product.id, it.qty + 1)}
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-bold">{formatPrice(price * it.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-bold">Resumen</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Envío" value="A coordinar" />
            <div className="my-3 h-px bg-border" />
            <div className="flex items-baseline justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="font-display text-2xl font-black">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Field label="Tu nombre" value={name} onChange={setName} placeholder="Juan Pérez" />
            <Field
              label="Dirección"
              value={address}
              onChange={setAddress}
              placeholder="Calle 123, Ciudad"
            />
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Método de pago
              </label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
                <option>MercadoPago</option>
              </select>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground shadow-brand transition-transform hover:scale-[1.01]"
          >
            Finalizar por WhatsApp →
          </a>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Te redirigimos a WhatsApp con el detalle del pedido.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40"
      />
    </div>
  );
}
