-- ============================================
-- MITLAR — About Cards Table
-- Run in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS about_cards (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order   int  NOT NULL DEFAULT 0,
  title        text NOT NULL,
  title_ua     text,
  title_pl     text,
  subtitle     text,
  subtitle_ua  text,
  subtitle_pl  text,
  description  text,
  description_ua text,
  description_pl text,
  bg_gradient  text NOT NULL DEFAULT 'linear-gradient(135deg, #3d4a33, #5a6b4a)',
  is_visible   boolean DEFAULT true
);

-- Seed with current 4 cards
INSERT INTO about_cards (sort_order, title, title_ua, title_pl, subtitle, subtitle_ua, subtitle_pl, description, description_ua, description_pl, bg_gradient) VALUES
(1,
  'The Field', 'Поле', 'Pole',
  'Dynamic play zones', 'Динамічні ігрові зони', 'Dynamiczne strefy gry',
  'Mitlar is played on a specially designed field divided into four interactive zones. Each zone has unique rules and tactical significance, requiring teams to adapt their strategy constantly.',
  'Mitlar грається на спеціально спроектованому полі, поділеному на чотири інтерактивні зони. Кожна зона має унікальні правила і тактичне значення.',
  'Mitlar rozgrywany jest na specjalnie zaprojektowanym boisku podzielonym na cztery interaktywne strefy.',
  'linear-gradient(135deg, #3d4a33, #5a6b4a)'
),
(2,
  'The Team', 'Команда', 'Drużyna',
  'Cooperation & strategy', 'Співпраця і стратегія', 'Współpraca i strategia',
  'A Mitlar team consists of 5 players, each riding a monowheel. Positions are fluid — players switch roles dynamically based on the game state, demanding deep team synchronisation.',
  'Команда Mitlar складається з 5 гравців на моноколесах. Позиції гнучкі — гравці динамічно змінюють ролі залежно від стану гри.',
  'Drużyna Mitlar składa się z 5 graczy na monokołach. Pozycje są płynne — gracze dynamicznie zmieniają role.',
  'linear-gradient(135deg, #5c4a30, #7a6240)'
),
(3,
  'The Equipment', 'Обладнання', 'Sprzęt',
  'Specially designed gear', 'Спеціально розроблене спорядження', 'Specjalnie zaprojektowany sprzęt',
  'Every piece of Mitlar equipment is custom-designed for the sport. From the gliding broom to protective wear — each item balances performance, safety and the unique aesthetics of the game.',
  'Кожен елемент обладнання Mitlar розроблений спеціально для цього виду спорту. Від ковзного мітла до захисного спорядження.',
  'Każdy element sprzętu Mitlar jest specjalnie zaprojektowany dla tego sportu. Od gliding broom po odzież ochronną.',
  'linear-gradient(135deg, #2e4a3d, #3d6b55)'
),
(4,
  'The Rules', 'Правила', 'Zasady',
  'Simple to learn, deep to master', 'Легко вивчити, важко опанувати', 'Proste do nauki, głębokie do opanowania',
  'Mitlar rules are crafted for intuitive entry while offering rich strategic depth. The scoring system rewards both individual skill and collective intelligence, making every match unique.',
  'Правила Mitlar розроблені для інтуїтивного старту, але пропонують багату стратегічну глибину. Система нарахування очок винагороджує і майстерність, і командний інтелект.',
  'Zasady Mitlar są stworzone dla intuicyjnego wejścia, oferując bogatą głębię strategiczną.',
  'linear-gradient(135deg, #3d3050, #564268)'
);

-- Enable RLS
ALTER TABLE about_cards ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read about_cards" ON about_cards FOR SELECT USING (true);
