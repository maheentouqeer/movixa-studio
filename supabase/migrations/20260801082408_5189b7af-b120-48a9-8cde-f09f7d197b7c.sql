-- 1) Replace has_role() usage in policies with inline EXISTS checks

-- user_roles
DROP POLICY IF EXISTS "Admins read all roles" ON public.user_roles;

-- contact_submissions
DROP POLICY IF EXISTS "Admins view all" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins delete" ON public.contact_submissions;

CREATE POLICY "Admins view all" ON public.contact_submissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins update" ON public.contact_submissions FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins delete" ON public.contact_submissions FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- videos
DROP POLICY IF EXISTS "Admins view all videos" ON public.videos;
DROP POLICY IF EXISTS "Admins insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admins update videos" ON public.videos;
DROP POLICY IF EXISTS "Admins delete videos" ON public.videos;

CREATE POLICY "Admins view all videos" ON public.videos FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins insert videos" ON public.videos FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins update videos" ON public.videos FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins delete videos" ON public.videos FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- 2) Storage policies: admin checks inline + published-only public reads
DROP POLICY IF EXISTS "Admins upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update videos storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete videos storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can read videos" ON storage.objects;

CREATE POLICY "Admins upload videos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins update videos storage" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins delete videos storage" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins read videos storage" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Published videos are readable" ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM public.videos v
    WHERE v.is_published = true
      AND v.storage_path = storage.objects.name
  )
);

-- 3) Lock down the SECURITY DEFINER helper
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
