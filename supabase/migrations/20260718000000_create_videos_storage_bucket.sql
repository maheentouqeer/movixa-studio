-- Ensure the admin video uploader has a backing public Storage bucket.
-- Public reads are intentional: homepage visitors need to stream published videos.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000,
  ARRAY[
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = now();
