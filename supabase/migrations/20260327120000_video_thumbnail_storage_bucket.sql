-- Public bucket for video card thumbnails (URL stored in public.videos.thumbnail).
-- After applying: existing data: URLs still work until you re-save each video from Admin
-- or run a one-off script; new uploads use Storage automatically.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-thumbnails',
  'video-thumbnails',
  true,
  5242880, -- 5 MB per object
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "video_thumbnails_select_public" ON storage.objects;
DROP POLICY IF EXISTS "video_thumbnails_insert_anon" ON storage.objects;
DROP POLICY IF EXISTS "video_thumbnails_update_anon" ON storage.objects;
DROP POLICY IF EXISTS "video_thumbnails_delete_anon" ON storage.objects;

-- Anyone can read thumbnails (public site + admin preview).
CREATE POLICY "video_thumbnails_select_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'video-thumbnails');

-- Anon key can upload/update/delete (admin UI uses anon key without Supabase Auth).
-- Harden later: signed uploads or a server route using the service role key.
CREATE POLICY "video_thumbnails_insert_anon"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'video-thumbnails');

CREATE POLICY "video_thumbnails_update_anon"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'video-thumbnails')
WITH CHECK (bucket_id = 'video-thumbnails');

CREATE POLICY "video_thumbnails_delete_anon"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'video-thumbnails');
