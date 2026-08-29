INSERT INTO public.site_sections (slot, label, title, description)
VALUES (
  'studio_system',
  'Studio System',
  'One studio for every digital touchpoint.',
  'Movixa connects website design, AI video production and brand visuals into one creative system, so your launch feels consistent from the first click to the final frame.'
)
ON CONFLICT (slot) DO UPDATE
SET label = EXCLUDED.label,
    title = EXCLUDED.title,
    description = EXCLUDED.description;
