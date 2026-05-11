import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/mitlar-logo.png" alt="Mitlar" width={40} height={40} style={{ objectFit: 'contain' }} />
      </div>
      <div className={styles.right}>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
