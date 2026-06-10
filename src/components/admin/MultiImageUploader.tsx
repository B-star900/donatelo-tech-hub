import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 * 10; // 10 años

export function MultiImageUploader({
  bucket = "productos",
  value,
  onChange,
  label = "Galería de imágenes",
  max = 8,
}: {
  bucket?: "productos" | "categorias";
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    const remaining = Math.max(0, max - value.length);
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) {
      toast.error(`Máximo ${max} imágenes`);
      return;
    }
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of list) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" supera 5 MB`);
          continue;
        }
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type,
          });
        if (upErr) {
          toast.error(upErr.message);
          continue;
        }
        const { data: signed } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, SIGNED_URL_EXPIRY);
        if (signed?.signedUrl) uploaded.push(signed.signedUrl);
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded]);
        toast.success(`${uploaded.length} imagen(es) subida(s)`);
      }
    } finally {
      setUploading(false);
    }
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label} ({value.length}/{max})
      </label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={url + i}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-foreground">
                Principal
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        ))}
        {value.length < max && (
          <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground hover:bg-secondary">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-xs">
                <Upload className="h-5 w-5" /> Agregar
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
