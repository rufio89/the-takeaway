-- Add image_url column to digests table
ALTER TABLE digests ADD COLUMN image_url TEXT;

-- Add comment
COMMENT ON COLUMN digests.image_url IS 'URL to the digest cover image';
