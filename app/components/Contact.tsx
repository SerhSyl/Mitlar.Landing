"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './Contact.module.css';

export default function Contact() {
  const { language } = useLanguage();
  const getL = (ua: string, en: string, pl: string) => language === 'ua' ? ua : (language === 'en' ? en : pl);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [rodo, setRodo] = useState(false);

  const subscribe = async (e: any) => {
    e.preventDefault();
    if (!rodo) { 
      alert(getL("Будь ласка, погодьтесь з умовами RODO щодо обробки даних.", "Please agree to the RODO data processing terms.", "Prosimy o wyrażenie zgody RODO na przetwarzanie danych.")); 
      return; 
    }
    
    // Using Supabase client linked earlier
    const { error } = await supabase.from('waitlist').insert([{ 
      email, 
      rodo_consent: rodo, 
      newsletter_consent: true, 
      source: 'footer_newsletter' 
    }]);

    if (error && error.code !== '23505') {
      alert(getL("Помилка підписки: ", "Subscription error: ", "Błąd subskrypcji: ") + error.message);
    } else {
      setSuccess(true);
      setEmail('');
    }
  };

  return (
    <footer className={styles.footerWrapper} id="contact">
      <div className={styles.footerContainer}>
        
        {/* Left: Contacts */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{getL('Контакти', 'Contact', 'Kontakt')}</h3>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> <a href="mailto:hello@mitlar.com">hello@mitlar.com</a></p>
            <p><strong>{getL('Телефон:', 'Phone:', 'Telefon:')}</strong> <a href="tel:+48780487180">+48 780 487 180</a></p>
            <p>{getL('Kraków, Польща', 'Krakow, Poland', 'Kraków, Polska')}</p>
          </div>
        </div>

        {/* Middle: Socials */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{getL('Соціальні мережі', 'Social Media', 'Sieci społecznościowe')}</h3>
          <div className={styles.socialLinks}>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
            <a href="#">Patreon</a>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{getL('Підписка на новини', 'Newsletter Subscription', 'Zapisz się na newsletter')}</h3>
          <p className={styles.newsletterDesc}>{getL('Отримуйте останні оновлення щодо розробки гри, спеціальні пропозиції екіпірування та новини.', 'Get the latest updates on game development, special equipment offers, and news.', 'Otrzymuj najnowsze aktualizacje dotyczące rozwoju gry, specjalne oferty sprzętu i wiadomości.')}</p>
          
          {success ? (
             <div className={styles.successMsg}>{getL('Дякуємо за підписку на наші новини!', 'Thank you for subscribing to our newsletter!', 'Dziękujemy za zasubskrybowanie naszego newslettera!')}</div>
          ) : (
             <form onSubmit={subscribe} className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder={getL('Ваш Email...', 'Your Email...', 'Twój Email...')} 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className={styles.emailInput}
                />
                
                <label className={styles.rodoLabel}>
                  <input 
                    type="checkbox" 
                    checked={rodo} 
                    onChange={e => setRodo(e.target.checked)} 
                    required 
                    className={styles.checkbox}
                  />
                  <span>
                    {getL('Я згоден(на) з ', 'I agree to the ', 'Zgadzam się z ')} <a href="#" className={styles.rodoLink}>{getL('Політикою конфіденційності (RODO)', 'Privacy Policy (RODO)', 'Polityką Prywatności (RODO)')}</a> {getL('та даю згоду на обробку персональних даних для цілей розсилки.', 'and consent to the processing of personal data for newsletter purposes.', 'i wyrażam zgodę na przetwarzanie danych osobowych w celach newslettera.')}
                  </span>
                </label>

                <button type="submit" className={styles.submitBtn}>{getL('Підписатись', 'Subscribe', 'Subskrybuj')}</button>
             </form>
          )}
        </div>

      </div>
      <div className={styles.copyright}>
        <p>© 2026 Mitlar. {getL('Всі права захищено.', 'All rights reserved.', 'Wszelkie prawa zastrzeżone.')}</p>
      </div>
    </footer>
  );
}
