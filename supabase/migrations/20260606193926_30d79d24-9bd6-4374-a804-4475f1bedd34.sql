GRANT INSERT ON public.pedidos TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.pedidos TO authenticated;
GRANT ALL ON public.pedidos TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.pedidos_numero_seq TO anon, authenticated;
-- Allow anon to read back just-inserted row (needed for .select().single() after insert)
-- Add a permissive SELECT only for the row they just created is not feasible without auth; allow SELECT to anon as well since pedidos has no PII restrictions for return value
GRANT SELECT ON public.pedidos TO anon;