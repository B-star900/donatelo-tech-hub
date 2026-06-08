
# Plan de trabajo — DONATELO

Es mucho alcance para un solo turno, así que lo divido en **5 fases** y las ejecuto en orden. Cada fase queda funcional antes de pasar a la siguiente. Te pido confirmación entre fases grandes para que puedas probar.

---

## Fase 1 — Bugs críticos (este turno)

Objetivo: que la tienda funcione 100% sin errores antes de agregar features nuevas.

- **Pedidos**: revisar `createOrder` y RLS de `pedidos`. Validar payload, capturar y mostrar el error real en pantalla.
- **WhatsApp**: validar número, escapar texto, abrir en nueva pestaña con fallback si el navegador bloquea `window.open`.
- **Fechas inválidas**: envolver todo `new Date(...)` en helper seguro `formatDate()` que devuelve `"—"` si la fecha es inválida (afecta a `/admin/pedidos`).
- **Stock al entregar**: trigger SQL que, cuando `pedidos.estado` pasa a `entregado`, descuente del `productos.stock` los `qty` del JSON `items` (idempotente — sólo descuenta una vez por pedido usando una columna `stock_descontado boolean`).
- **localStorage seguro**: try/catch alrededor de lecturas/escrituras del carrito; descartar items con producto inválido o stock 0 al hidratar.
- **Validación de productos**: `ProductCard` y carrito tolerantes a `price`, `stock`, `images` undefined.

## Fase 2 — Admin solo por email autorizado

- Mantener email+password (es lo seguro). Confirmar que `auto_confirm_email` está activo (ya lo está).
- Asegurar que **sólo** `donatelocelulares@gmail.com` puede ser admin: el trigger `handle_new_user` ya lo hace; añadir además una policy que impida que otro usuario obtenga rol admin manualmente.
- Deshabilitar `signUp` público en `/auth` — solo botón "Entrar". El admin se crea una sola vez.
- Verificar que todas las rutas `/admin/*` están bajo `_authenticated` + chequeo `isAdmin` (ya está en `admin.tsx`).

## Fase 3 — Productos: multi-imágenes, colores, ofertas

Migración SQL:
- `productos.galeria jsonb` ya existe → usarla para múltiples imágenes (ya está, sólo falta UI).
- Nueva columna `colores jsonb` `[{nombre, hex}, ...]`.
- Ya existen `precio_original`, `en_oferta` → usarlas para descuentos (% o fijo calculado en frontend).

UI admin (`admin.productos.tsx`):
- `ImageUploader` con múltiples archivos → guarda en bucket `productos` y persiste array de URLs en `galeria`.
- Editor de colores: input nombre + color picker, agregar/quitar chips.
- Toggle "En oferta" + input precio rebajado → calcula y muestra el % de descuento.

UI tienda:
- `ProductCard` y `producto.$id.tsx`: galería con miniaturas, swatches de color, badge "-XX%" si hay oferta.

## Fase 4 — Banners rotativos + Sponsors

Nuevas tablas:
- `banners` (titulo, subtitulo, imagen_url, link_url, orden, activo)
- `sponsors` (nombre, logo_url, link_url, orden, activo)

UI admin: nuevas pestañas `/admin/banners` y `/admin/sponsors` con CRUD + upload.
UI tienda: carousel rotativo en `index.tsx` (usando el componente `carousel` de shadcn ya instalado) + sección de sponsors antes del footer.

## Fase 5 — Migración a SPA estática para cPanel

Esto es el paso final, **después** de que todo lo demás funcione en Lovable.

Cambios:
- Sustituir `vite.config.ts` (`@lovable.dev/vite-tanstack-config`) por `vite` puro + `@vitejs/plugin-react`.
- Reemplazar TanStack Start por **TanStack Router en modo SPA** (mismo árbol de rutas `src/routes/`, mismos `createFileRoute`, sin `__root.tsx` shell SSR).
- Crear `index.html` raíz + `src/main.tsx` con `<RouterProvider>`.
- Borrar `src/server.ts`, `src/start.ts`, `src/integrations/supabase/client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, `src/lib/*.functions.ts` (no se usan — todo el data access ya es client-side vía `supabase` browser client).
- Cambiar `process.env.SUPABASE_*` por `import.meta.env.VITE_SUPABASE_*` donde aplique.
- Agregar `public/.htaccess` con fallback a `index.html` para rutas SPA.
- `npm run build` → carpeta `dist/` lista para subir a `public_html`.

**Importante**: esta migración rompe el preview de Lovable (Lovable hostea TanStack Start). Antes de hacerla te confirmo y te explico cómo seguir editando.

---

## Esta vuelta hago Fase 1 + Fase 2

Son los bugs y la seguridad — lo más urgente. Cuando confirmes que la tienda y el admin andan bien, sigo con Fase 3 (productos avanzados), Fase 4 (banners/sponsors) y al final Fase 5 (migración a estático).

¿Te parece bien que arranque así?
