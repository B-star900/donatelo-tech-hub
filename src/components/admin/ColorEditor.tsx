import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { ProductColor } from "@/lib/products";

export function ColorEditor({
  value,
  onChange,
}: {
  value: ProductColor[];
  onChange: (next: ProductColor[]) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [hex, setHex] = useState("#000000");

  function add() {
    const n = nombre.trim();
    if (!n) return;
    if (value.some((c) => c.nombre.toLowerCase() === n.toLowerCase())) return;
    onChange([...value, { nombre: n, hex }]);
    setNombre("");
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Colores disponibles
      </label>
      <div className="flex flex-wrap gap-2">
        {value.map((c, i) => (
          <span
            key={c.nombre + i}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary py-1 pl-1 pr-2 text-xs"
          >
            <span
              className="h-5 w-5 rounded-full border border-border"
              style={{ background: c.hex }}
            />
            {c.nombre}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="grid h-5 w-5 place-items-center rounded-full hover:bg-background"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-background"
        />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Nombre (ej: Negro)"
          className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-10 items-center gap-1 rounded-full border border-border px-3 text-xs font-bold hover:bg-secondary"
        >
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>
    </div>
  );
}
