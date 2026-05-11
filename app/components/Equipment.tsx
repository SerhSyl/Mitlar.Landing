"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './Equipment.module.css';

export default function Equipment() {
  const { language } = useLanguage();
  const getLS = (ua: string, en: string, pl: string) => language === 'ua' ? ua : (language === 'en' ? en : pl);
  const getF = (item: any, field: string) => {
    if (!item) return '';
    return language === 'ua' ? item[field] : (item[`${field}_${language}`] || item[field] || '');
  };
  const [items, setItems] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [rodo, setRodo] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState<number | null>(null);

  const [showRodoModal, setShowRodoModal] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase.from('equipment').select('*').order('id');
      if (data) setItems(data);
    }
    fetchItems();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent, item: any) => {
    e.preventDefault();
    if (!rodo) {
      alert(getLS("Ви повинні дати згоду на обробку даних (RODO).", "You must consent to data processing (RODO).", "Musisz wyrazić zgodę na przetwarzanie danych (RODO)."));
      return;
    }

    const { error } = await supabase.from('waitlist').insert({
      email,
      equipment_id: item.id,
      equipment_name: item.name,
      rodo_consent: true,
      source: 'equipment'
    });

    if (!error) {
      setWaitlistSuccess(item.id);
      setEmail("");
      setRodo(false);
      // Success message timeout
      setTimeout(() => setWaitlistSuccess(null), 5000);
    }
  };

  return (
    <div className={styles.equipmentWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.line}></div>
        <h2 className={styles.sectionTitle}>{getLS('Обладнання для гри', 'Game Equipment', 'Sprzęt do gry')}</h2>
        <div className={styles.line}></div>
      </div>
      
      <div className={styles.scrollContainer}>
        <div className={styles.scrollTrack}>
          {items.map(item => (
            <div 
              key={item.id} 
              className={`${styles.card} ${activeItem === item.id ? styles.cardActive : ''}`}
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
            >
              <div className={styles.imagePlaceholder}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  "Зображення"
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.itemName}>{getF(item, 'name')}</h3>
                {getF(item, 'subtitle') && <p className={styles.itemSubtitle}>{getF(item, 'subtitle')}</p>}
                <p className={styles.itemPrice}>{item.price ? item.price : getLS("Ціна уточнюється", "Price TBD", "Cena wkrótce")}</p>
                
                <div 
                  className={`${styles.expandableDetails} ${activeItem === item.id ? styles.expanded : ''}`}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <p className={styles.itemDesc}>{getF(item, 'description')}</p>
                  
                  {waitlistSuccess === item.id ? (
                    <div className={styles.successMsg}>{getLS('Дякуємо! Ваш email додано до списку очікування.', 'Thank you! Your email is added to the waitlist.', 'Dziękujemy! Twój email został dodany do listy oczekujących.')}</div>
                  ) : (
                    <form className={styles.waitlistForm} onSubmit={(e) => handleWaitlistSubmit(e, item)}>
                      <p className={styles.waitlistNotif}>{getLS('Запишіться на лист очікування, якщо хочете щоб ми повідомили вас коли товар буде доступний.', 'Join the waitlist if you want us to notify you when the item becomes available.', 'Zapisz się na listę oczekujących, jeśli chcesz, abyśmy powiadomili Cię, gdy produkt będzie dostępny.')}</p>
                      <input 
                        type="email" 
                        required 
                        placeholder={getLS('Ваш email...', 'Your email...', 'Twój email...')} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.emailInput}
                      />
                      <div className={styles.rodoLabelContainer}>
                        <div onClick={() => setShowRodoModal(true)} className={styles.rodoLink}>
                          {getLS('Згода RODO (Обов\'язково). Натисніть щоб вибрати.', 'RODO Consent (Required). Click to accept.', 'Zgoda RODO (Wymagane). Kliknij, aby zaakceptować.')}
                        </div>
                        {rodo ? <span className={styles.rodoStatusGreen}>✅ Погоджено</span> : <span className={styles.rodoStatusRed}>❌ Відхилено / Не вибрано</span>}
                      </div>
                      <button type="submit" className={styles.submitEmailBtn}>{getLS('Попереднє замовлення', 'Pre-order', 'Zamówienie w przedsprzedaży')}</button>
                    </form>
                  )}
                </div>
                
                <button className={styles.notifyBtn}>
                  {activeItem === item.id ? getLS("Менше", "Less", "Mniej") : getLS("Більше", "More", "Więcej")}
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>

      {/* RODO Modal */}
      {showRodoModal && (
        <div className={styles.modalOverlay}>
           <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
             <h3 className={styles.modalTitle}>Згода на обробку даних (RODO)</h3>
             <p className={styles.modalText}>
               Відповідно до Загального регламенту про захист даних (GDPR / RODO), ви даєте згоду на збереження та обробку вашої електронної адреси виключно з метою інформування вас щодо оновлень, доступності товарів та новин гри Mitlar. Ваші дані не будуть передані третім особам. Ви можете відписатись у будь-який момент.
             </p>
             <div className={styles.modalActions}>
               <button type="button" className={styles.modalBtnReject} onClick={() => { setRodo(false); setShowRodoModal(false); }}>Not Ok (Відхилити)</button>
               <button type="button" className={styles.modalBtnAccept} onClick={() => { setRodo(true); setShowRodoModal(false); }}>Ok (Погоджуюсь)</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
