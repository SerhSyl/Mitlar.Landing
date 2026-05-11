-- Таблиця для товарів (Обладнання)
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Таблиця для списку очікування (Waitlist)
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Таблиця для блогу
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  external_url TEXT,
  status TEXT DEFAULT 'standard', -- варіанти: 'featured', 'pinned', 'standard'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Додаємо початкові товари, які вже були на сторінці (щоб перевірити роботу)
INSERT INTO equipment (name, price, description) VALUES 
('Електро уніцикл', '$399', 'Спеціалізоване моноколесо для екстремальних маневрів та гри.'),
('Золотий м''яч', '$35', 'Основний ігровий м''яч з аеродинамічними елементами.'),
('Дрон-шукач', '$89', 'Автономний дрон, який літає на полі і приносить додаткові бали.'),
('Мітла-гак', '$49', 'Інструмент для перехоплення м''яча та балансування у повітрі.'),
('Іскро-м''яч', '$59', 'Спеціальний м''яч з LED-підсвіткою, який приносить бонусні очки.');
