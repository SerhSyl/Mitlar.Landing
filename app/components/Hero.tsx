import { supabase } from '../../lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';
import styles from './Hero.module.css';

interface HeroData {
  title: string;
  slogan: string;
  button_text: string;
  image_url: string | null;
}

const FALLBACK: HeroData = {
  title: 'MITLAR',
  slogan: 'Team game on the gliding broom',
  button_text: 'Learn more',
  image_url: null,
};

async function getHeroData(): Promise<HeroData> {
  noStore();
  try {
    const { data, error } = await supabase
      .from('hero')
      .select('title, slogan, button_text, image_url')
      .single();
    if (error || !data) return FALLBACK;
    return data;
  } catch {
    return FALLBACK;
  }
}

export default async function Hero() {
  const hero = await getHeroData();
  // Use image_url from DB if set, otherwise show gradient placeholder
  const hasBg = !!hero.image_url;

  return (
    <section className={styles.section} id="section-hero">
      <div className={styles.glassCard}>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>{hero.title}</h1>
            <p className={styles.slogan}>{hero.slogan}</p>
            <a href="#section-devblog" className={styles.btn}>
              {hero.button_text}
            </a>
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
