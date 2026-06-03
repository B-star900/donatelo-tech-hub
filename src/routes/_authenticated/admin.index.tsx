import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Tags, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

async function fetchStats() {
  const [productsRes, categoriesRes, ordersRes] = await Promise.all([
    supabase.from("productos").select("id", { count: "exact", head: true }),
    supabase.from("categorias").select("id", { count: "exact", head: true }),
    supabase.from("pedidos").select("total, estado, created_at").order("created_at", { ascending: false }),
  ]);
  const orders = ordersRes.data ?? [];
  const revenue = orders.reduce((s, o) => s + Number(o.total ?? 0), 0);
  const pending = orders.filter((o) => o.estado === "pendiente").length;
  return {
    products: productsRes.count ?? 0,
    categories: categoriesRes.count ?? 0,
    orders: orders.length,
    pending,
    revenue,
    recent: orders.slice(0, 5),
  };
}

function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Resumen del negocio.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Package} label="Productos" value={data?.products ?? (isLoading ? "..." : 0)} />
        <Stat icon={Tags} label="Categorías" value={data?.categories ?? (isLoading ? "..." : 0)} />
        <Stat icon={ShoppingBag} label="Pedidos" value={data?.orders ?? (isLoading ? "..." : 0)} hint={`${data?.pending ?? 0} pendientes`} />
        <Stat icon={DollarSign} label="Ingresos" value={data ? formatPrice(data.revenue) : "..."} />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Últimos pedidos</h2>
        {data && data.recent.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">Aún no hay pedidos.</p>
        )}
        <ul className="mt-3 divide-y divide-border">
          {data?.recent.map((o, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-muted-foreground">
                {new Date(o.created_at).toLocaleString("es-AR")}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
                {o.estado}
              </span>
              <span className="font-bold">{formatPrice(Number(o.total))}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <p className="mt-2 font-display text-2xl font-black">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
