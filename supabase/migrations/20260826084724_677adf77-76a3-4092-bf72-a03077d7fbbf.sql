CREATE TABLE public.site_sections (
  slot TEXT PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT,
  storage_path TEXT,
  video_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
GRANT ALL ON public.site_sections TO service_role;

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site sections are publicly readable"
ON public.site_sections FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site sections"
ON public.site_sections FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE TRIGGER update_site_sections_updated_at
BEFORE UPDATE ON public.site_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_sections (slot, label, title, description) VALUES
  ('film_reel', 'Film Reel', 'Built to be watched.', 'A cinematic reel of the work we are most proud of.'),
  ('frame_sequence', 'Frame Sequence', 'Scroll becomes direction.', 'Cinematic sequences engineered frame by frame.'),
  ('brand_visuals', 'Brand Visuals', 'Your brand, in motion.', 'From identity systems to everyday content, we create the visual language your brand carries everywhere.'),
  ('digital_experiences', 'Digital Experiences', 'We don''t just design websites.', 'We build digital experiences.');

CREATE POLICY "Public can read section videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos'
  AND EXISTS (SELECT 1 FROM public.site_sections s WHERE s.storage_path = storage.objects.name)
);