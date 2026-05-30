'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';
import styles from './DevBlog.module.css';

interface BlogPost {
  id: string;
  title: string;    title_ua: string;    title_pl: string;
  excerpt: string | null; excerpt_ua: string | null; excerpt_pl: string | null;
  content: string | null; content_ua: string | null; content_pl: string | null;
  pin_position: number | null;
  created_at: string;
}

export default function DevBlog() {
  const { language } = useLanguage();
  const gl = (en: string, ua: string, pl: string) =>
    language === 'ua' ? ua : language === 'pl' ? pl : en;
  const gf = (en: string | null, ua: string | null, pl: string | null) =>
    (language === 'ua' ? ua : language === 'pl' ? pl : en) ?? en ?? '';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [showAllList, setShowAllList] = useState(false);

  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subRodo, setSubRodo] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, title_ua, title_pl, excerpt, excerpt_ua, excerpt_pl, content, content_ua, content_pl, pin_position, created_at')
      .eq('is_published', true)
      .order('pin_position', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data as BlogPost[]); });
  }, []);

  const pinned1  = posts.find(p => p.pin_position === 1);
  const pinned2  = posts.find(p => p.pin_position === 2);
  const pinned3  = posts.find(p => p.pin_position === 3);
  const unpinned = posts.filter(p => p.pin_position === null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      language === 'ua' ? 'uk-UA' : language === 'pl' ? 'pl-PL' : 'en-GB',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubError('');
    if (!subRodo) {
      setSubError(gl(
        'Please agree to the Privacy Policy (RODO).',
        'Погодьтесь з Політикою конфіденційності (RODO).',
        'Prosimy o wyrażenie zgody na Politykę Prywatności (RODO).'
      ));
      return;
    }
    const { error } = await supabase.from('waitlist').insert([{
      email: subEmail, rodo_consent: subRodo, newsletter_consent: true, source: 'devblog_modal',
    }]);
    if (error && error.code !== '23505') {
      setSubError(gl('Subscription error: ', 'Помилка підписки: ', 'Błąd subskrypcji: ') + error.message);
    } else {
      setSubSuccess(true);
      setSubEmail('');
    }
  };

  const openSubscribe = () => { setSubSuccess(false); setSubError(''); setShowSubscribe(true); };

  const readLabel      = gl('Read article →',      'Читати →',                      'Czytaj →');
  const allLabel       = gl('All articles ↓',      'Всі статті ↓',                 'Wszystkie artykuły ↓');
  const hideLabel      = gl('Hide articles ↑',     'Сховати ↑',                    'Ukryj ↑');
  const subscribeLabel = gl('Subscribe for updates','Підписатись на оновлення',     'Subskrybuj');
  const closeLabel     = gl('Close',               'Закрити',                       'Zamknij');

  const renderCard = (post: BlogPost, cls: string, tag: string) => (
    <div
      className={`${cls} ${styles.blogCard}`}
      onClick={() => setActivePost(post)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setActivePost(post)}
    >
      <span className={styles.tag}>{tag}</span>
      <h3 className={styles.cardTitle}>{gf(post.title, post.title_ua, post.title_pl)}</h3>
      {gf(post.excerpt, post.excerpt_ua, post.excerpt_pl) &&
        <p className={styles.excerpt}>{gf(post.excerpt, post.excerpt_ua, post.excerpt_pl)}</p>}
      <span className={styles.readMore}>{readLabel}</span>
    </div>
  );

  return (
    <>
      <section className={styles.section} id="section-devblog">
        <div className={styles.glassCard}>
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>{gl('Dev Blog', 'Дев Блог', 'Dev Blog')}</h2>
            <div className={styles.pinnedArea}>
              {pinned1 && renderCard(pinned1, styles.pin1, gl('Development Update', 'Оновлення', 'Aktualizacja'))}
              {(pinned2 || pinned3) && (
                <div className={styles.pinRow}>
                  {pinned2 && renderCard(pinned2, styles.pin2, gl('Design', 'Дизайн', 'Design'))}
                  {pinned3 && renderCard(pinned3, styles.pin3, gl('Equipment', 'Обладнання', 'Sprzęt'))}
                </div>
              )}
            </div>
            {unpinned.length > 0 && (
              <div className={styles.allList}>
                <button className={styles.allBtn} onClick={() => setShowAllList(s => !s)}>
                  {showAllList ? hideLabel : allLabel}
                </button>
                {showAllList && (
                  <div className={styles.listItems}>
                    {unpinned.map(post => (
                      <div key={post.id} className={styles.listItem}
                        onClick={() => setActivePost(post)} role="button" tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setActivePost(post)}>
                        <strong>{gf(post.title, post.title_ua, post.title_pl)}</strong>
                        {gf(post.excerpt, post.excerpt_ua, post.excerpt_pl) &&
                          <p>{gf(post.excerpt, post.excerpt_ua, post.excerpt_pl)}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== ARTICLE MODAL ===== */}
      {activePost && (
        <div className={styles.modalOverlay}
          onClick={e => { if (e.target === e.currentTarget) setActivePost(null); }}>
          <div className={styles.modalBox}>
            <button className={styles.modalClose} onClick={() => setActivePost(null)} aria-label="Close">✕</button>
            <span className={styles.tag}>{gl('Development Update', 'Оновлення', 'Aktualizacja')}</span>
            <h3 className={styles.modalTitle}>{gf(activePost.title, activePost.title_ua, activePost.title_pl)}</h3>
            <p className={styles.modalDate}>{formatDate(activePost.created_at)}</p>
            <div className={styles.modalBody}>
              {(gf(activePost.content, activePost.content_ua, activePost.content_pl) ?? '').split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.subscribeBtn} onClick={openSubscribe}>{subscribeLabel}</button>
              <button className={styles.closeBtn} onClick={() => setActivePost(null)}>{closeLabel}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBSCRIBE MODAL ===== */}
      {showSubscribe && (
        <div className={styles.subscribeOverlay}
          onClick={e => { if (e.target === e.currentTarget) setShowSubscribe(false); }}>
          <div className={styles.subscribeBox}>
            <button className={styles.modalClose} onClick={() => setShowSubscribe(false)} aria-label="Close">✕</button>
            <h3 className={styles.modalTitle}>{gl('Stay updated', 'Будь в курсі', 'Bądź na bieżąco')}</h3>
            <p className={styles.subscribeSubtitle}>
              {gl('Be the first to hear about Mitlar developments.',
                  'Першим дізнавайся про розвиток Mitlar.',
                  'Bądź pierwszym, który dowie się o rozwoju Mitlar.')}
            </p>
            {subSuccess ? (
              <p className={styles.successMsg}>
                {gl("Thank you! You're subscribed. 🌿", 'Дякуємо! Ви підписані. 🌿', 'Dziękujemy! Jesteś zapisany. 🌿')}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
                <input type="email" required className={styles.subInput}
                  placeholder={gl('Your email address', 'Ваш email...', 'Twój email...')}
                  value={subEmail} onChange={e => setSubEmail(e.target.value)} />
                <label className={styles.rodoLabel}>
                  <input type="checkbox" checked={subRodo} onChange={e => setSubRodo(e.target.checked)} className={styles.checkbox} />
                  <span>
                    {gl('I consent to data processing — ', 'Я даю згоду на обробку даних — ', 'Wyrażam zgodę na przetwarzanie danych — ')}
                    <span className={styles.rodoLink}>{gl('Privacy Policy (RODO)', 'Політика конфіденційності (RODO)', 'Polityka Prywatności (RODO)')}</span>
                  </span>
                </label>
                {subError && <p className={styles.errorMsg}>{subError}</p>}
                <button type="submit" className={styles.subSubmitBtn}>{gl('Subscribe', 'Підписатись', 'Subskrybuj')}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
