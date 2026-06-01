'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './About.module.css';

interface AboutCard {
  id: string;
  sort_order: number;
  title: string;       title_ua: string;       title_pl: string;
  subtitle: string;    subtitle_ua: string;    subtitle_pl: string;
  description: string; description_ua: string; description_pl: string;
  bg_gradient: string;
  image_url: string | null;
}

export default function About() {
  const { language } = useLanguage();
  const [cards, setCards] = useState<AboutCard[]>([]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Fetch cards
    supabase
      .from('about_cards')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setCards(data as AboutCard[]); });

    // Fetch banner_url from sections
    supabase
      .from('sections')
      .select('banner_url')
      .eq('key', 'about')
      .single()
      .then(({ data }) => {
        if (data && (data as any).banner_url) setBannerUrl((data as any).banner_url);
      });
  }, []);

  const g = (card: AboutCard, field: 'title' | 'subtitle' | 'description') => {
    if (language === 'ua') return card[`${field}_ua`] || card[field];
    if (language === 'pl') return card[`${field}_pl`] || card[field];
    return card[field];
  };

  // Card background: image if set, otherwise gradient
  const cardBgStyle = (card: AboutCard): React.CSSProperties =>
    card.image_url
      ? { backgroundImage: `url(${card.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: card.bg_gradient };

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => { setActiveId(null); setIsClosing(false); }, 220);
  }, []);

  const toggle = (id: string) => {
    if (activeId === id) { close(); }
    else { setIsClosing(false); setActiveId(id); }
  };

  const activeCard = cards.find(c => c.id === activeId) ?? null;
  const moreLabel    = language === 'ua' ? 'Більше ↓' : language === 'pl' ? 'Więcej ↓' : 'More ↓';
  const sectionTitle = language === 'ua' ? 'Про гру'  : language === 'pl' ? 'O grze'   : 'About the Game';

  return (
    <section className={styles.section} id="section-about">
      <div className={styles.glassCard}>
        <div className={styles.layout}>
          <div className={styles.leftPanel}>
            <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
            <div className={styles.grid}>
              {cards.map(card => (
                <div key={card.id} className={styles.card}
                  onClick={() => toggle(card.id)} role="button" tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggle(card.id)}>
                  {/* Background: photo or gradient */}
                  <div className={styles.cardBg} style={cardBgStyle(card)} />
                  {/* Gradient overlay — always visible */}
                  <div className={styles.cardGradient} />
                  <div className={styles.cardInner}>
                    <h3 className={styles.cardTitle}>{g(card, 'title')}</h3>
                    <p className={styles.cardSubtitle}>{g(card, 'subtitle')}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.toggleBtn}>{moreLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded overlay */}
            {activeCard && (
              <div className={`${styles.expandOverlay} ${isClosing ? styles.expandOverlayOut : ''}`}
                onClick={e => { if (e.target === e.currentTarget) close(); }}>
                <div
                  className={`${styles.expandBox} ${isClosing ? styles.expandBoxOut : ''}`}
                  style={cardBgStyle(activeCard)}
                >
                  {/* Gradient overlay preserved in expanded view too */}
                  <div className={styles.expandGradient} />
                  <div className={styles.expandInner}>
                    <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
                    <h3 className={styles.expandTitle}>{g(activeCard, 'title')}</h3>
                    <p className={styles.expandSubtitle}>{g(activeCard, 'subtitle')}</p>
                    <p className={styles.expandDesc}>{g(activeCard, 'description')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right banner: image if set, otherwise dark gradient placeholder */}
          <div className={styles.rightBanner}>
            <div
              className={styles.bannerPlaceholder}
              style={bannerUrl
                ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined}
            />
            <div className={styles.bannerFade} />
          </div>
        </div>
      </div>
    </section>
  );
}
