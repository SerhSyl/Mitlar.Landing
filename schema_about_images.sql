-- Add image_url to each About card
ALTER TABLE about_cards ADD COLUMN IF NOT EXISTS image_url text;

-- Add banner_url to sections (for the About section right-side banner)
ALTER TABLE sections ADD COLUMN IF NOT EXISTS banner_url text;
