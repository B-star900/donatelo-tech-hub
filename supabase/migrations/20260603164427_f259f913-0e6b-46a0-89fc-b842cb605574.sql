
CREATE POLICY "Public read productos imgs" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id IN ('productos','categorias'));
CREATE POLICY "Admin insert productos imgs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('productos','categorias') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin update productos imgs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('productos','categorias') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete productos imgs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('productos','categorias') AND public.has_role(auth.uid(),'admin'));
