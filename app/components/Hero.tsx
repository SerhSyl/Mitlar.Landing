'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './Hero.module.css';

interface HeroData {
  title: string;
  slogan: string;    slogan_ua: string;    slogan_pl: string;
  button_text: string; button_text_ua: string; button_text_pl: string;
  image_url: string | null;
}

const FALLBACK: HeroData = {
  title: 'MITLAR',
  slogan: 'Team game on the gliding broom',
  slogan_ua: 'Командна гра на моноколесах із gliding broom',
  slogan_pl: 'Gra zespołowa na monokołach z gliding broom',
  button_text: 'Learn more',
  button_text_ua: 'Дізнатись більше',
  button_text_pl: 'Dowiedz się więcej',
  image_url: null,
};

export default function Hero() {
  const { language } = useLanguage();
  const [hero, setHero] = useState<HeroData>(FALLBACK);

  useEffect(() => {
    supabase
      .from('hero')
      .select('title, slogan, slogan_ua, slogan_pl, button_text, button_text_ua, button_text_pl, image_url')
      .single()
      .then(({ data }) => { if (data) setHero({ ...FALLBACK, ...data }); });
  }, []);

  const slogan = language === 'ua' ? (hero.slogan_ua || hero.slogan)
               : language === 'pl' ? (hero.slogan_pl || hero.slogan)
               : hero.slogan;

  const btnText = language === 'ua' ? (hero.button_text_ua || hero.button_text)
                : language === 'pl' ? (hero.button_text_pl || hero.button_text)
                : hero.button_text;

  const hasBg = !!hero.image_url;

  return (
    <section className={styles.section} id="section-hero">
      <div className={styles.glassCard}>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>{hero.title}</h1>
            <p className={styles.slogan}>{slogan}</p>
            <a href="#section-devblog" className={styles.btn}>{btnText}</a>
          </div>
          <div className={styles.banner}>
            <div
              className={styles.bannerImage}
              style={hasBg
                ? { backgroundImage: `url(${JSON.stringify(hero.image_url)})` }
                : { background: 'linear-gradient(135deg, #4a5342, #8b6d47, #c39d67)' }
              }
            />
            <div className={styles.blurLeft} />
          </div>
        </div>
      </div>
    </section>
  );
}
