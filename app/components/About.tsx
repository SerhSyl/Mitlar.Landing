"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './About.module.css';

export default function About() {
  const { language } = useLanguage();
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveZone(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultZones = [
    {
      id: 1, title: 'Ігровий процес', short: 'В чому полягає гра',
      desc: 'Дві команди змагаються на полі 10х10 метрів. Гравці розбиті на локальні зони, де взаємодіють з м\'ячами та опонентами. Мета — провести м\'яч між всіма зонами у заданій послідовності без падіння. Кожна взаємодія потребує синхронізації між членами команди.'
    },
    {
      id: 2, title: 'Гравці та екіпіровка', short: 'Як виглядають учасники',
      desc: 'Гравець пересувається на моноколесі (електроуніциклі), тримаючи \'мітлу\' для балансу та маніпуляцій з м\'ячем. Захисне екіпірування є обов\'язковим. Це включає шолом, наколінники, налокітники та спеціальне взуття для кращого зчеплення.'
    },
    {
      id: 3, title: 'Правила гри', short: 'Бали та механіка',
      desc: 'Що довше команда утримує контроль над м\'ячем між передачами з зони в зону, тим вищий множник балів. Опонент намагається перехопити ініціативу або вибити м\'яч. Кожен раунд триває 10 хвилин, після чого рахунок фіксується.'
    },
    {
      id: 4, title: 'Безпека', short: 'Свідомість ризиків',
      desc: 'Цей вид спорту пов\'язаний з високою швидкістю на монотранспорті. Колеса обмежуються за швидкістю, а гравці проходять обов\'язкову сертифікацію безпечних падінь. Перед кожним матчем проводиться розминка та перевірка обладнання.'
    },
  ];

  const [rawData, setRawData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchZones() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'about_game');
      if (data && data.length > 0) setRawData(data);
    }
    fetchZones();
  }, []);

  const displayZones = defaultZones.map(z => {
    const match = rawData.find(d => d.block_key === `zone_${z.id}`);
    if (match) {
      const getL = (field: string) =>
        language === 'ua' ? match[field] : (match[`${field}_${language}`] || match[field]);
      let imgUrl = match.image_url || null;
      if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) imgUrl = '/' + imgUrl;
      return {
        ...z,
        title: getL('title') || z.title,
        subtitle: getL('button_text') || z.short,
        desc: getL('content') || z.desc,
        image_url: imgUrl,
      };
    }
    return { ...z, subtitle: z.short, image_url: null };
  });

  const moreLabel   = language === 'ua' ? 'Більше' : (language === 'en' ? 'More' : 'Więcej');
  const sectionTitle = language === 'ua' ? 'Про гру' : (language === 'en' ? 'About the game' : 'O grze');

  return (
    <div className={styles.aboutWrapper} id="about">
      <div className={styles.sectionHeader}>
        <div className={styles.line} />
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        <div className={styles.line} />
      </div>

      <div className={styles.splitContainer}>
        {/* ── Left: SVG Field + Zone Overlays ── */}
        <div className={styles.leftAlignedField} ref={containerRef}>
          <div className={styles.pitchGraphics}>

            {/* ── NEW SVG: matches hand-drawn sketch ── */}
            <svg viewBox="0 0 100 100" className={styles.svgField} aria-hidden="true">
              {/* Outer rounded border */}
              <rect x="1.5" y="1.5" width="97" height="97" rx="13" ry="13"
                fill="none" stroke="var(--color-text-header)" strokeWidth="1.0" />

              {/* Top-left quadrant */}
              <rect x="3.5" y="3.5" width="43" height="43" rx="9" ry="9"
                fill="none" stroke="var(--color-text-header)" strokeWidth="0.8" />
              {/* Top-right quadrant */}
              <rect x="53.5" y="3.5" width="43" height="43" rx="9" ry="9"
                fill="none" stroke="var(--color-text-header)" strokeWidth="0.8" />
              {/* Bottom-left quadrant */}
              <rect x="3.5" y="53.5" width="43" height="43" rx="9" ry="9"
                fill="none" stroke="var(--color-text-header)" strokeWidth="0.8" />
              {/* Bottom-right quadrant */}
              <rect x="53.5" y="53.5" width="43" height="43" rx="9" ry="9"
                fill="none" stroke="var(--color-text-header)" strokeWidth="0.8" />

              {/* Horizontal separator lines — stop at circle */}
              <line x1="3.5"  y1="50" x2="43"   y2="50"
                stroke="var(--color-text-header)" strokeWidth="0.5" opacity="0.55" />
              <line x1="57"   y1="50" x2="96.5" y2="50"
                stroke="var(--color-text-header)" strokeWidth="0.5" opacity="0.55" />
              {/* Vertical separator lines — stop at circle */}
              <line x1="50" y1="3.5"  x2="50" y2="43"
                stroke="var(--color-text-header)" strokeWidth="0.5" opacity="0.55" />
              <line x1="50" y1="57"   x2="50" y2="96.5"
                stroke="var(--color-text-header)" strokeWidth="0.5" opacity="0.55" />

              {/* Center: outer circle */}
              <circle cx="50" cy="50" r="7"
                fill="var(--color-bg-primary)"
                stroke="var(--color-text-header)" strokeWidth="1.0" />
              {/* Center: inner ring */}
              <circle cx="50" cy="50" r="3.8"
                fill="none"
                stroke="var(--color-text-header)" strokeWidth="0.7" />
            </svg>

            {/* ── Zone overlays ── */}
            {displayZones.map(zone => (
              <div
                key={zone.id}
                className={`${styles.quadrantOverlay} ${styles[`quadrantPos${zone.id}`]} ${activeZone === zone.id ? styles.activeQuadrant : ''}`}
                onClick={() => setActiveZone(zone.id === activeZone ? null : zone.id)}
                role="button"
                aria-label={zone.title}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveZone(zone.id === activeZone ? null : zone.id)}
              >
                {activeZone === zone.id ? (
                  /* ── EXPANDED card ── */
                  <>
                    {zone.image_url && (
                      <div
                        className={styles.expandedBgImage}
                        style={{ backgroundImage: `url(${zone.image_url})` }}
                      />
                    )}
                    <div className={styles.expandedContentOverlay}>
                      {/* Close */}
                      <button
                        className={styles.closeCardBtn}
                        onClick={e => { e.stopPropagation(); setActiveZone(null); }}
                        aria-label="Close"
                      >×</button>

                      <div className={styles.localExpandedCard}>
                        {/* Text: flows left */}
                        <h4 className={styles.cardTitle}>{zone.title}</h4>
                        {zone.subtitle && (
                          <p className={styles.expandedSubtitle}>{zone.subtitle}</p>
                        )}
                        <p className={styles.cardDesc}>{zone.desc}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── COLLAPSED card ── */
                  <div className={styles.previewContent}>
                    {zone.image_url && (
                      <div
                        className={styles.previewBgImage}
                        style={{ backgroundImage: `url(${zone.image_url})` }}
                      />
                    )}
                    <div className={styles.previewContentOverlay}>
                      <h3 className={styles.previewTitle}>{zone.title}</h3>
                      {zone.subtitle && (
                        <p className={styles.previewSubtitle}>{zone.subtitle}</p>
                      )}
                      <span className={styles.previewMoreBtn}>{moreLabel}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: gradient-faded image banner ── */}
        <div className={styles.rightImageBanner}>
          <div className={styles.imageGradientFade} />
        </div>
      </div>
    </div>
  );
}
