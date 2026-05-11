"use client";
import styles from './LanguageSwitcher.module.css';
import { useLanguage } from '../../lib/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={styles.langSwitcher}>
      <span className={language === 'en' ? styles.active : styles.lang} onClick={() => setLanguage('en')}>EN</span> / 
      <span className={language === 'ua' ? styles.active : styles.lang} onClick={() => setLanguage('ua')}>UA</span> / 
      <span className={language === 'pl' ? styles.active : styles.lang} onClick={() => setLanguage('pl')}>PL</span>
    </div>
  );
}
