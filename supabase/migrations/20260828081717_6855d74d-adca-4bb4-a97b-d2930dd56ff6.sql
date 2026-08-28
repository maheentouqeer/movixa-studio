ALTER TABLE public.site_sections
  ADD COLUMN IF NOT EXISTS image_paths text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}'::text[];

CREATE POLICY "Public can read section images"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id = 'videos'
  AND EXISTS (SELECT 1 FROM public.site_sections s WHERE objects.name = ANY (s.image_paths))
);

DELETE FROM public.site_sections WHERE slot = 'film_reel';

UPDATE public.site_sections
SET label = 'AI Ads + CGI',
    title = 'Scroll becomes direction.',
    description = 'Cinematic sequences engineered frame by frame.'
WHERE slot = 'frame_sequence';

INSERT INTO public.site_sections (slot, label, title, description)
VALUES ('frame_sequence', 'AI Ads + CGI', 'Scroll becomes direction.', 'Cinematic sequences engineered frame by frame.')
ON CONFLICT (slot) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('instagram_url', 'https://instagram.com'),
  ('youtube_url', 'https://youtube.com'),
  ('facebook_url', 'https://facebook.com')
ON CONFLICT (key) DO NOTHING;