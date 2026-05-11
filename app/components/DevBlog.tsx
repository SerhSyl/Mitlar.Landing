import { supabase } from '../../lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';
import styles from './DevBlog.module.css';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  pin_position: number | null;
  created_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  noStore(); // always fetch fresh from DB
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, content, pin_position, created_at')
    .eq('is_published', true)
    .order('pin_position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export default async function DevBlog() {
  const posts = await getBlogPosts();
  const pinned1 = posts.find(p => p.pin_position === 1);
  const pinned2 = posts.find(p => p.pin_position === 2);
  const pinned3 = posts.find(p => p.pin_position === 3);
  const unpinned = posts.filter(p => p.pin_position === null);

  return (
    <section className={styles.section} id="section-devblog">
      <div className={styles.glassCard}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Dev Blog</h2>

          {/* Pinned layout */}
          <div className={styles.pinnedArea}>
            {pinned1 && (
              <div className={`${styles.pin1} ${styles.blogCard}`} data-post-id={pinned1.id}>
                <span className={styles.tag}>Development Update</span>
                <h3 className={styles.cardTitle}>{pinned1.title}</h3>
                {pinned1.excerpt && <p className={styles.excerpt}>{pinned1.excerpt}</p>}
                <span className={styles.readMore}>Read article →</span>
              </div>
            )}

            {(pinned2 || pinned3) && (
              <div className={styles.pinRow}>
                {pinned2 && (
                  <div className={`${styles.pin2} ${styles.blogCard}`} data-post-id={pinned2.id}>
                    <span className={styles.tag}>Design</span>
                    <h3 className={styles.cardTitle}>{pinned2.title}</h3>
                    {pinned2.excerpt && <p className={styles.excerpt}>{pinned2.excerpt}</p>}
                  </div>
                )}
                {pinned3 && (
                  <div className={`${styles.pin3} ${styles.blogCard}`} data-post-id={pinned3.id}>
                    <span className={styles.tag}>Equipment</span>
                    <h3 className={styles.cardTitle}>{pinned3.title}</h3>
                    {pinned3.excerpt && <p className={styles.excerpt}>{pinned3.excerpt}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All articles list */}
          {unpinned.length > 0 && (
            <div className={styles.allList}>
              <h3 className={styles.allTitle}>More articles</h3>
              {unpinned.map(post => (
                <div key={post.id} className={styles.listItem}>
                  <strong>{post.title}</strong>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
