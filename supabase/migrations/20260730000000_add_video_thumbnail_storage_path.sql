ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS thumbnail_storage_path text;

UPDATE storage.buckets
SET
  public = true,
  allowed_mime_types = ARRAY[
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ],
  updated_at = now()
WHERE id = 'videos';
