import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, formatPrice, slugify } from "@/lib/products";
import type { Database } from "@/integrations/supabase/types";
import { ImageUploader } from "@/components/admin/ImageUploader";

type ProductRow = Database["public"]["Tables"]["productos"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/productos")({
  component: ProductosAdmin,
});

async function fetchAll() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(nombre)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function ProductosAdmin() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ["admin-productos"], queryFn: fetchAll });
  const { data: cats } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-productos"] });
      qc.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto eliminado");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products?.length ?? 0} en catálogo
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-brand-foreground"
        >
          <Plus className="h-4 w-4" /> Nuevo
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Cargando...
                </td>
              </tr>
            )}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Aún no hay productos. Creá el primero.
                </td>
              </tr>
            )}
            {products?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imagen_url ? (
                      <img src={p.imagen_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-secondary" />
                    )}
                    <div>
                      <div className="font-semibold">{p.nombre}</div>
                      <div className="text-xs text-muted-foreground">{p.marca}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(p as any).categorias?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(Number(p.precio))}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                    className="mr-1 inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar "${p.nombre}"?`)) del.mutate(p.id);
                    }}
                    className="inline-grid h-8 w-8 place-items-center rounded-lg text-brand hover:bg-brand/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <ProductDialog
          initial={editing}
          categorias={cats ?? []}
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-productos"] });
            qc.invalidateQueries({ queryKey: ["productos"] });
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ProductDialog({
  initial,
  categorias,
  onClose,
  onSaved,
}: {
  initial: ProductRow | null;
  categorias: { id: string; nombre: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nombre: initial?.nombre ?? "",
    slug: initial?.slug ?? "",
    descripcion: initial?.descripcion ?? "",
    precio: initial?.precio ? String(initial.precio) : "",
    precio_original: initial?.precio_original ? String(initial.precio_original) : "",
    categoria_id: initial?.categoria_id ?? categorias[0]?.id ?? "",
    marca: initial?.marca ?? "",
    imagen_url: initial?.imagen_url ?? "",
    stock: initial?.stock != null ? String(initial.stock) : "0",
    destacado: initial?.destacado ?? false,
    en_oferta: initial?.en_oferta ?? false,
  });

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        slug: form.slug || slugify(form.nombre),
        descripcion: form.descripcion || null,
        precio: Number(form.precio || 0),
        precio_original: form.precio_original ? Number(form.precio_original) : null,
        categoria_id: form.categoria_id || null,
        marca: form.marca || null,
        imagen_url: form.imagen_url || null,
        stock: Number(form.stock || 0),
        destacado: form.destacado,
        en_oferta: form.en_oferta,
        activo: true,
      };
      if (initial) {
        const { error } = await supabase.from("productos").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Producto actualizado");
      } else {
        const { error } = await supabase.from("productos").insert(payload);
        if (error) throw error;
        toast.success("Producto creado");
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
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-elegant"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {initial ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid max-h-[70vh] gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
          <Field label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v, slug: form.slug || slugify(v) })} required />
          <Field label="Slug (URL)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="iphone-15-pro" />
          <Field label="Marca" value={form.marca} onChange={(v) => setForm({ ...form, marca: v })} />
          <div>
            <Label>Categoría</Label>
            <select
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
            >
              <option value="">(sin categoría)</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <Field label="Precio actual" type="number" value={form.precio} onChange={(v) => setForm({ ...form, precio: v })} required />
          <Field label="Precio original (si está en oferta)" type="number" value={form.precio_original} onChange={(v) => setForm({ ...form, precio_original: v })} />
          <Field label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <div className="sm:col-span-2">
            <ImageUploader
              bucket="productos"
              value={form.imagen_url}
              onChange={(url) => setForm({ ...form, imagen_url: url })}
              label="Imagen del producto"
            />
          </div>
          <Field label="O pegar URL de imagen" value={form.imagen_url} onChange={(v) => setForm({ ...form, imagen_url: v })} placeholder="https://..." />
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.en_oferta} onChange={(e) => setForm({ ...form, en_oferta: e.target.checked })} />
            En oferta
          </label>
          <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-11 rounded-full border border-border px-5 text-sm font-semibold">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-brand px-6 text-sm font-bold text-brand-foreground disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40"
      />
    </div>
  );
}
