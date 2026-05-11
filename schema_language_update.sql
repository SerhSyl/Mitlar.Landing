-- Додаємо підтримку англійської та польської мов для налаштувань сайту (банери, тексти)
ALTER TABLE site_settings 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_pl TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS content_pl TEXT,
  ADD COLUMN IF NOT EXISTS button_text_en TEXT,
  ADD COLUMN IF NOT EXISTS button_text_pl TEXT;

-- Додаємо підтримку англійської та польської мов для товарів
ALTER TABLE equipment 
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_pl TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_pl TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_pl TEXT;

-- Додаємо підтримку англійської та польської мов для блог-постів
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_pl TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_pl TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS content_pl TEXT;
