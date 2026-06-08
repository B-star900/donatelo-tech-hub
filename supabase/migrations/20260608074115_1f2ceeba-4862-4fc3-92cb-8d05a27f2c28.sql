
-- 1. Add flag to prevent double-decrement
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS stock_descontado boolean NOT NULL DEFAULT false;

-- 2. Function: decrement stock from items JSON when order is delivered
CREATE OR REPLACE FUNCTION public.descontar_stock_pedido()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  prod_slug text;
  qty int;
BEGIN
  -- Only act when transitioning to 'entregado' and not yet discounted
  IF NEW.estado = 'entregado' AND COALESCE(OLD.stock_descontado, false) = false THEN
    FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(NEW.items, '[]'::jsonb))
    LOOP
      prod_slug := item->>'slug';
      qty := COALESCE((item->>'qty')::int, 0);
      IF prod_slug IS NOT NULL AND qty > 0 THEN
        UPDATE public.productos
        SET stock = GREATEST(stock - qty, 0),
            updated_at = now()
        WHERE slug = prod_slug OR id::text = prod_slug;
      END IF;
    END LOOP;
    NEW.stock_descontado := true;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Trigger
DROP TRIGGER IF EXISTS trg_descontar_stock_pedido ON public.pedidos;
CREATE TRIGGER trg_descontar_stock_pedido
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.descontar_stock_pedido();
