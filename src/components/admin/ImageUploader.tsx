import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 * 10; // 10 años

export function ImageUploader({
  bucket,
  value,
  onChange,
  label = "Imagen",
}: {
  bucket: "productos" | "categorias";
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagen demasiado grande (máx 5 MB)");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, SIGNED_URL_EXPIRY);
      if (signErr) throw signErr;
      onChange(signed.signedUrl);
      toast.success("Imagen subida");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground">
            <Upload className="h-5 w-5" />
          </div>
        )}
        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-secondary">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> {value ? "Cambiar" : "Subir imagen"}
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
