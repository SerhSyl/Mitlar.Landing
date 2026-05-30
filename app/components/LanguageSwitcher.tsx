"use client";
import styles from './LanguageSwitcher.module.css';
import { useLanguage } from '../../lib/LanguageContext';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
  { code: 'pl', label: 'PL' },
] as const;

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={styles.langSwitcher}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`${styles.langBtn} ${language === code ? styles.langBtnActive : ''}`}
          onClick={() => setLanguage(code)}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
