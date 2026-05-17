import { supabase } from '../../../lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from './post.module.css';

interface Post {
  id: string;
  title: string;
  title_ua: string | null;
  title_pl: string | null;
  excerpt: string | null;
  content: string | null;
  content_ua: string | null;
  content_pl: string | null;
  created_at: string;
}

async function getPost(id: string): Promise<Post | null> {
  noStore();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, title_ua, title_pl, excerpt, content, content_ua, content_pl, created_at')
    .eq('id', id)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id);
  return {
    title: post ? `${post.title} — Mitlar Dev Blog` : 'Article not found',
    description: post?.excerpt ?? '',
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <a href="/#devblog" className={styles.backLink}>← Back to Dev Blog</a>
        <article className={styles.article}>
          <header className={styles.header}>
            <span className={styles.tag}>Development Update</span>
            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
            <time className={styles.date}>{date}</time>
          </header>
          <div className={styles.content}>
            {(post.content ?? '').split('\n').map((paragraph, i) =>
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
