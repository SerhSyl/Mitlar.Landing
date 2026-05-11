"use client";
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { t } = useLanguage();
  return (
    <aside className={styles.sidebarWrapper}>
      <div className={styles.menuHandle}>☰ {t('nav.menu').toUpperCase()}</div>
      <nav className={styles.nav}>
        <ul>
          <li><Link href="#hero" className={styles.navLink}>{t('nav.home')}</Link></li>
          <li><Link href="#about" className={styles.navLink}>{t('nav.about')}</Link></li>
          <li><Link href="#equipment" className={styles.navLink}>{t('nav.equipment')}</Link></li>
          <li><Link href="#devblog" className={styles.navLink}>{t('nav.devblog')}</Link></li>
          <li><Link href="#contact" className={styles.navLink}>{t('nav.contact')}</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
