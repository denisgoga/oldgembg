-- Allow "native" size (same footprint as homepage video thumbnails in the catalog grid).
ALTER TABLE homepage_banners DROP CONSTRAINT IF EXISTS homepage_banners_size_check;

ALTER TABLE homepage_banners
  ADD CONSTRAINT homepage_banners_size_check
  CHECK (size IN ('300x250', '300x100', 'native'));
