'use client';
import { useState, useCallback } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './About.module.css';

const CARDS = [
  {
    id: 1,
    title:    { ua: 'Поле',        en: 'The Field',      pl: 'Pole' },
    subtitle: { ua: 'Динамічні ігрові зони', en: 'Dynamic play zones', pl: 'Dynamiczne strefy gry' },
    desc: {
      ua: 'Mitlar грається на спеціально спроектованому полі, поділеному на чотири інтерактивні зони. Кожна зона має унікальні правила і тактичне значення, що вимагає від команд постійної адаптації стратегії.',
      en: 'Mitlar is played on a specially designed field divided into four interactive zones. Each zone has unique rules and tactical significance, requiring teams to adapt their strategy constantly.',
      pl: 'Mitlar rozgrywany jest na specjalnie zaprojektowanym boisku podzielonym na cztery interaktywne strefy. Każda strefa ma unikalne zasady i znaczenie taktyczne, co wymaga ciągłego dostosowywania strategii.',
    },
    bg: 'linear-gradient(135deg, #3d4a33, #5a6b4a)',
  },
  {
    id: 2,
    title:    { ua: 'Команда',     en: 'The Team',       pl: 'Drużyna' },
    subtitle: { ua: 'Співпраця і стратегія', en: 'Cooperation & strategy', pl: 'Współpraca i strategia' },
    desc: {
      ua: 'Команда Mitlar складається з 5 гравців на моноколесах. Позиції гнучкі — гравці динамічно змінюють ролі залежно від стану гри, що вимагає глибокої командної синхронізації.',
      en: 'A Mitlar team consists of 5 players, each riding a monowheel. Positions are fluid — players switch roles dynamically based on the game state, demanding deep team synchronisation.',
      pl: 'Drużyna Mitlar składa się z 5 graczy na monokołach. Pozycje są płynne — gracze dynamicznie zmieniają role w zależności od stanu gry, wymagając głębokiej synchronizacji zespołu.',
    },
    bg: 'linear-gradient(135deg, #5c4a30, #7a6240)',
  },
  {
    id: 3,
    title:    { ua: 'Обладнання', en: 'The Equipment',  pl: 'Sprzęt' },
    subtitle: { ua: 'Спеціально розроблене спорядження', en: 'Specially designed gear', pl: 'Specjalnie zaprojektowany sprzęt' },
    desc: {
      ua: 'Кожен елемент обладнання Mitlar розроблений спеціально для цього виду спорту. Від ковзного мітла до захисного спорядження — кожен предмет поєднує ефективність, безпеку та унікальну естетику.',
      en: 'Every piece of Mitlar equipment is custom-designed for the sport. From the gliding broom to protective wear — each item balances performance, safety and the unique aesthetics of the game.',
      pl: 'Każdy element sprzętu Mitlar jest specjalnie zaprojektowany dla tego sportu. Od gliding broom po odzież ochronną — każdy przedmiot łączy wydajność, bezpieczeństwo i unikalną estetykę gry.',
    },
    bg: 'linear-gradient(135deg, #2e4a3d, #3d6b55)',
  },
  {
    id: 4,
    title:    { ua: 'Правила',     en: 'The Rules',      pl: 'Zasady' },
    subtitle: { ua: 'Легко вивчити, важко опанувати', en: 'Simple to learn, deep to master', pl: 'Proste do nauki, głębokie do opanowania' },
    desc: {
      ua: 'Правила Mitlar розроблені для інтуїтивного старту, але пропонують багату стратегічну глибину. Система нарахування очок винагороджує як індивідуальну майстерність, так і командний інтелект.',
      en: 'Mitlar rules are crafted for intuitive entry while offering rich strategic depth. The scoring system rewards both individual skill and collective intelligence, making every match unique.',
      pl: 'Zasady Mitlar są stworzone dla intuicyjnego wejścia, oferując bogatą głębię strategiczną. System punktacji nagradza zarówno indywidualne umiejętności, jak i zbiorową inteligencję.',
    },
    bg: 'linear-gradient(135deg, #3d3050, #564268)',
  },
];

export default function About() {
  const { language } = useLanguage();
  const g = (field: { ua: string; en: string; pl: string }) =>
    language === 'ua' ? field.ua : language === 'pl' ? field.pl : field.en;

  const [activeId, setActiveId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveId(null);
      setIsClosing(false);
    }, 220);
  }, []);

  const toggle = (id: number) => {
    if (activeId === id) {
      close();
    } else {
      setIsClosing(false);
      setActiveId(id);
    }
  };

  const activeCard = CARDS.find(c => c.id === activeId) ?? null;

  const moreLabel    = language === 'ua' ? 'Більше ↓' : language === 'pl' ? 'Więcej ↓' : 'More ↓';
  const sectionTitle = language === 'ua' ? 'Про гру'  : language === 'pl' ? 'O grze'   : 'About the Game';

  return (
    <section className={styles.section} id="section-about">
      <div className={styles.glassCard}>
        <div className={styles.layout}>

          {/* ── Left: title + 2×2 grid ── */}
          <div className={styles.leftPanel}>
            <h2 className={styles.sectionTitle}>{sectionTitle}</h2>

            <div className={styles.grid}>
              {CARDS.map(card => (
                <div
                  key={card.id}
                  className={styles.card}
                  onClick={() => toggle(card.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggle(card.id)}
                >
                  <div className={styles.cardBg} style={{ background: card.bg }} />
                  <div className={styles.cardGradient} />
                  <div className={styles.cardInner}>
                    <h3 className={styles.cardTitle}>{g(card.title)}</h3>
                    <p className={styles.cardSubtitle}>{g(card.subtitle)}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.toggleBtn}>{moreLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Expanded card overlay (80% of leftPanel) ── */}
            {activeCard && (
              <div
                className={`${styles.expandOverlay} ${isClosing ? styles.expandOverlayOut : ''}`}
                onClick={e => { if (e.target === e.currentTarget) close(); }}
              >
                <div
                  className={`${styles.expandBox} ${isClosing ? styles.expandBoxOut : ''}`}
                  style={{ background: activeCard.bg }}
                >
                  <div className={styles.expandGradient} />
                  <div className={styles.expandInner}>
                    <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
                    <h3 className={styles.expandTitle}>{g(activeCard.title)}</h3>
                    <p className={styles.expandSubtitle}>{g(activeCard.subtitle)}</p>
                    <p className={styles.expandDesc}>{g(activeCard.desc)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: banner placeholder ── */}
          <div className={styles.rightBanner}>
            <div className={styles.bannerPlaceholder} />
            <div className={styles.bannerFade} />
          </div>

        </div>
      </div>
    </section>
  );
}
