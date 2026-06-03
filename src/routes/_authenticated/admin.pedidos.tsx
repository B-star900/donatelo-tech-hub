import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/pedidos")({
  component: PedidosAdmin,
});

const ESTADOS = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];

async function fetchOrders() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function PedidosAdmin() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery({ queryKey: ["admin-pedidos"], queryFn: fetchOrders });

  const updateStatus = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pedidos"] });
      toast.success("Estado actualizado");
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pedidos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pedidos"] });
      toast.success("Pedido eliminado");
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Pedidos</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders?.length ?? 0} pedidos</p>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-muted-foreground">Cargando...</p>}
        {orders?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Aún no hay pedidos. Cuando un cliente finalice por WhatsApp aparecerá acá.
          </div>
        )}
        {orders?.map((o) => {
          const items = (Array.isArray(o.items) ? o.items : []) as Array<{
            nombre: string;
            qty: number;
            precio: number;
          }>;
          return (
            <details key={o.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold">#{o.numero}</span>
                <div className="flex-1">
                  <div className="font-semibold">{o.cliente_nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.cliente_telefono} · {new Date(o.created_at).toLocaleString("es-AR")}
                  </div>
                </div>
                <select
                  value={o.estado}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus.mutate({ id: o.id, estado: e.target.value })}
                  className="h-9 rounded-full border border-border bg-background px-3 text-xs font-semibold"
                >
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="font-display text-lg font-black">{formatPrice(Number(o.total))}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("¿Eliminar pedido?")) del.mutate(o.id);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg text-brand hover:bg-brand/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </summary>
              <div className="border-t border-border bg-secondary/30 px-5 py-4 text-sm">
                {o.cliente_direccion && (
                  <p className="mb-2"><span className="font-semibold">Dirección:</span> {o.cliente_direccion}</p>
                )}
                {o.notas && <p className="mb-2"><span className="font-semibold">Notas:</span> {o.notas}</p>}
                <ul className="space-y-1">
                  {items.map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{it.qty}× {it.nombre}</span>
                      <span className="font-semibold">{formatPrice(it.precio * it.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
