import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea una fecha de forma segura. Devuelve "—" si no es válida. */
export function formatDate(value: unknown, locale = "es-AR"): string {
  if (!value) return "—";
  try {
    const d = new Date(value as string);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString(locale);
  } catch {
    return "—";
  }
}
