'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './DevBlog.module.css';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  pin_position: number | null;
  created_at: string;
}

export default function DevBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [showAllList, setShowAllList] = useState(false);

  // Subscribe modal state
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subRodo, setSubRodo] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, excerpt, content, pin_position, created_at')
      .eq('is_published', true)
      .order('pin_position', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data); });
  }, []);

  const pinned1  = posts.find(p => p.pin_position === 1);
  const pinned2  = posts.find(p => p.pin_position === 2);
  const pinned3  = posts.find(p => p.pin_position === 3);
  const unpinned = posts.filter(p => p.pin_position === null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubError('');
    if (!subRodo) {
      setSubError('Please agree to the Privacy Policy (RODO).');
      return;
    }
    const { error } = await supabase.from('waitlist').insert([{
      email: subEmail,
      rodo_consent: subRodo,
      newsletter_consent: true,
      source: 'devblog_modal',
    }]);
    if (error && error.code !== '23505') {
      setSubError('Subscription error: ' + error.message);
    } else {
      setSubSuccess(true);
      setSubEmail('');
    }
  };

  const openSubscribe = () => {
    setSubSuccess(false);
    setSubError('');
    setShowSubscribe(true);
  };

  return (
    <>
      <section className={styles.section} id="section-devblog">
        <div className={styles.glassCard}>
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Dev Blog</h2>

            {/* Pinned layout */}
            <div className={styles.pinnedArea}>
              {pinned1 && (
                <div
                  className={`${styles.pin1} ${styles.blogCard}`}
                  onClick={() => setActivePost(pinned1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActivePost(pinned1)}
                >
                  <span className={styles.tag}>Development Update</span>
                  <h3 className={styles.cardTitle}>{pinned1.title}</h3>
                  {pinned1.excerpt && <p className={styles.excerpt}>{pinned1.excerpt}</p>}
                  <span className={styles.readMore}>Read article →</span>
                </div>
              )}

              {(pinned2 || pinned3) && (
                <div className={styles.pinRow}>
                  {pinned2 && (
                    <div
                      className={`${styles.pin2} ${styles.blogCard}`}
                      onClick={() => setActivePost(pinned2)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setActivePost(pinned2)}
                    >
                      <span className={styles.tag}>Design</span>
                      <h3 className={styles.cardTitle}>{pinned2.title}</h3>
                      {pinned2.excerpt && <p className={styles.excerpt}>{pinned2.excerpt}</p>}
                      <span className={styles.readMore}>Read article →</span>
                    </div>
                  )}
                  {pinned3 && (
                    <div
                      className={`${styles.pin3} ${styles.blogCard}`}
                      onClick={() => setActivePost(pinned3)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setActivePost(pinned3)}
                    >
                      <span className={styles.tag}>Equipment</span>
                      <h3 className={styles.cardTitle}>{pinned3.title}</h3>
                      {pinned3.excerpt && <p className={styles.excerpt}>{pinned3.excerpt}</p>}
                      <span className={styles.readMore}>Read article →</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* All articles toggle */}
            {unpinned.length > 0 && (
              <div className={styles.allList}>
                <button
                  className={styles.allBtn}
                  onClick={() => setShowAllList(s => !s)}
                >
                  {showAllList ? 'Hide articles ↑' : 'All articles ↓'}
                </button>
                {showAllList && (
                  <div className={styles.listItems}>
                    {unpinned.map(post => (
                      <div
                        key={post.id}
                        className={styles.listItem}
                        onClick={() => setActivePost(post)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setActivePost(post)}
                      >
                        <strong>{post.title}</strong>
                        {post.excerpt && <p>{post.excerpt}</p>}
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
        <div
          className={styles.modalOverlay}
          onClick={e => { if (e.target === e.currentTarget) setActivePost(null); }}
        >
          <div className={styles.modalBox}>
            <button
              className={styles.modalClose}
              onClick={() => setActivePost(null)}
              aria-label="Close"
            >✕</button>

            <span className={styles.tag}>Development Update</span>
            <h3 className={styles.modalTitle}>{activePost.title}</h3>
            <p className={styles.modalDate}>{formatDate(activePost.created_at)}</p>

            <div className={styles.modalBody}>
              {(activePost.content ?? '').split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.subscribeBtn} onClick={openSubscribe}>
                Subscribe for updates
              </button>
              <button className={styles.closeBtn} onClick={() => setActivePost(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBSCRIBE MODAL (on top of article modal) ===== */}
      {showSubscribe && (
        <div
          className={styles.subscribeOverlay}
          onClick={e => { if (e.target === e.currentTarget) setShowSubscribe(false); }}
        >
          <div className={styles.subscribeBox}>
            <button
              className={styles.modalClose}
              onClick={() => setShowSubscribe(false)}
              aria-label="Close"
            >✕</button>

            <h3 className={styles.modalTitle}>Stay updated</h3>
            <p className={styles.subscribeSubtitle}>
              Be the first to hear about Mitlar developments.
            </p>

            {subSuccess ? (
              <p className={styles.successMsg}>Thank you! You&apos;re subscribed. 🌿</p>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  className={styles.subInput}
                />
                <label className={styles.rodoLabel}>
                  <input
                    type="checkbox"
                    checked={subRodo}
                    onChange={e => setSubRodo(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>
                    I consent to data processing —{' '}
                    <span className={styles.rodoLink}>RODO / Privacy Policy</span>
                  </span>
                </label>
                {subError && <p className={styles.errorMsg}>{subError}</p>}
                <button type="submit" className={styles.subSubmitBtn}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
