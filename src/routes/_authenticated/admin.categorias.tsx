import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, slugify } from "@/lib/products";
import type { Database } from "@/integrations/supabase/types";

type Cat = Database["public"]["Tables"]["categorias"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: CategoriasAdmin,
});

function CategoriasAdmin() {
  const qc = useQueryClient();
  const { data: cats, isLoading } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categorias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría eliminada");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">{cats?.length ?? 0} categorías</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-brand-foreground"
        >
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Cargando...</td></tr>
            )}
            {cats?.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-semibold">{c.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3">{c.orden}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(c); setOpen(true); }} className="mr-1 inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => confirm(`¿Eliminar "${c.nombre}"?`) && del.mutate(c.id)} className="inline-grid h-8 w-8 place-items-center rounded-lg text-brand hover:bg-brand/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <CategoryDialog
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["categorias"] });
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CategoryDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Cat | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [orden, setOrden] = useState(initial?.orden ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { nombre, slug: slug || slugify(nombre), orden };
      if (initial) {
        const { error } = await supabase.from("categorias").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Categoría actualizada");
      } else {
        const { error } = await supabase.from("categorias").insert(payload);
        if (error) throw error;
        toast.success("Categoría creada");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial ? "Editar categoría" : "Nueva categoría"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nombre</label>
            <input value={nombre} onChange={(e) => { setNombre(e.target.value); if (!initial) setSlug(slugify(e.target.value)); }} required className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Orden</label>
            <input type="number" value={orden} onChange={(e) => setOrden(Number(e.target.value))} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-11 rounded-full border border-border px-5 text-sm font-semibold">Cancelar</button>
            <button type="submit" disabled={saving} className="h-11 rounded-full bg-brand px-6 text-sm font-bold text-brand-foreground disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
