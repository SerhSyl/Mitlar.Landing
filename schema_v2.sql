-- Оновлення таблиці товарів (додаємо підзаголовок та зображення)
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- Оновлення таблиці списку очікування (RODO, розсилки, джерело)
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS rodo_consent BOOLEAN DEFAULT false;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS newsletter_consent BOOLEAN DEFAULT false;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'general';
