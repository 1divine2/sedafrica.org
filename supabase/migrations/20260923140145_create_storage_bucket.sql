/*
# Create Storage Bucket for Photo Uploads

Creates a public storage bucket for website photos managed through the CMS.

1. Storage
- `website-photos` bucket for uploaded images
- Public access for reading (website visitors can see photos)
- Authenticated admin users can upload, update, and delete

2. Important Notes
- Bucket is public so photos can be displayed on the website
- Only admin users can modify contents
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('website-photos', 'website-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read photos" ON storage.objects;
CREATE POLICY "Public read photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'website-photos');

DROP POLICY IF EXISTS "Admin upload photos" ON storage.objects;
CREATE POLICY "Admin upload photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'website-photos'
    AND EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin update photos" ON storage.objects;
CREATE POLICY "Admin update photos" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'website-photos'
    AND EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid())
  ) WITH CHECK (
    bucket_id = 'website-photos'
    AND EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin delete photos" ON storage.objects;
CREATE POLICY "Admin delete photos" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'website-photos'
    AND EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid())
  );
