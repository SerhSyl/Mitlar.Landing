'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  toggleSectionVisibility,
  updateHero,
  createPost,
  updatePost,
  togglePublish,
  setPinPosition,
  deletePost,
} from '../actions/admin';
import styles from './admin.module.css';

// ---- Types ----
interface SectionRow { key: string; is_visible: boolean; sort_order: number; }
interface HeroData {
  slogan: string; slogan_pl: string; slogan_ua: string;
  button_text: string; button_text_pl: string; button_text_ua: string;
  image_url: string;
}
interface BlogPost {
  id: string; title: string; title_pl: string; title_ua: string;
  excerpt: string; excerpt_pl: string; excerpt_ua: string;
  content: string; content_pl: string; content_ua: string;
  pin_position: number | null; is_published: boolean; created_at: string;
}

type TabKey = 'hero' | 'about' | 'equipment' | 'devblog' | 'contacts';
const TAB_LABELS: Record<TabKey, string> = {
  hero: '🦸 Hero', about: '🏟 About', equipment: '🛴 Equipment',
  devblog: '📝 Dev Blog', contacts: '📬 Contacts',
};

// ---- PostRow ----
function PostRow({ post, lang, onTogglePublish, onPin, onDelete, onSave }: {
  post: BlogPost; lang: 'en' | 'pl' | 'ua';
  onTogglePublish: (id: string, cur: boolean) => void;
  onPin: (id: string, pin: number | null) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, data: Partial<BlogPost>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<BlogPost>>(post);
  function f(key: keyof BlogPost, label: string, multi = false) {
    const val = (draft[key] ?? '') as string;
    return (
      <div className={styles.formGroup} key={key}>
        <label className={styles.label}>{label}</label>
        {multi
          ? <textarea className={styles.input} rows={4} value={val} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} />
          : <input className={styles.input} value={val} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} />}
      </div>
    );
  }
  return (
    <div className={styles.postRow}>
      <div className={styles.postMeta}>
        <span className={`${styles.publishBadge} ${post.is_published ? styles.published : styles.draft}`}>
          {post.is_published ? 'Published' : 'Draft'}
        </span>
        {post.pin_position != null && <span className={styles.pinBadge}>Pin {post.pin_position}</span>}
        <strong className={styles.postTitle}>{post.title}</strong>
      </div>
      <div className={styles.postActions}>
        <button className={styles.btnSm} onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Edit'}</button>
        <button className={styles.btnSm} onClick={() => onTogglePublish(post.id, post.is_published)}>
          {post.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button className={styles.btnSm} onClick={() => onPin(post.id, 1)}>📌1</button>
        <button className={styles.btnSm} onClick={() => onPin(post.id, 2)}>📌2</button>
        <button className={styles.btnSm} onClick={() => onPin(post.id, 3)}>📌3</button>
        <button className={styles.btnSm} onClick={() => onPin(post.id, null)}>✕ pin</button>
        <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => onDelete(post.id)}>Delete</button>
      </div>
      {open && (
        <div className={styles.postForm}>
          {lang === 'en' && <>{f('title','Title (EN)')}{f('excerpt','Excerpt (EN)',true)}{f('content','Content (EN)',true)}</>}
          {lang === 'pl' && <>{f('title_pl','Title (PL)')}{f('excerpt_pl','Excerpt (PL)',true)}{f('content_pl','Content (PL)',true)}</>}
          {lang === 'ua' && <>{f('title_ua','Title (UA)')}{f('excerpt_ua','Excerpt (UA)',true)}{f('content_ua','Content (UA)',true)}</>}
          <div className={styles.formActions}>
            <button className={styles.btn} onClick={() => { onSave(post.id, draft); setOpen(false); }}>Save</button>
            <button className={styles.btnOutline} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Section Visibility Toggle ----
function SectionToggle({ section, onToggle }: { section: SectionRow; onToggle: (key: string, cur: boolean) => void }) {
  return (
    <div className={styles.visibilityRow}>
      <div>
        <strong className={styles.visLabel}>{section.key.charAt(0).toUpperCase() + section.key.slice(1)}</strong>
        <p className={styles.visHint}>
          {section.is_visible ? 'Visible on public site' : 'Hidden from public site'}
        </p>
      </div>
      <button
        className={`${styles.toggleBtn} ${section.is_visible ? styles.toggleOn : styles.toggleOff}`}
        onClick={() => onToggle(section.key, section.is_visible)}
      >
        {section.is_visible ? '✓ Visible' : '✕ Hidden'}
      </button>
    </div>
  );
}

// ---- Main ----
export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [password, setPassword] = useState('');
  const [tab,      setTab]      = useState<TabKey>('hero');
  const [lang,     setLang]     = useState<'en' | 'pl' | 'ua'>('en');
  const [msg,      setMsg]      = useState('');
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [hero, setHero] = useState<HeroData>({ slogan:'', slogan_pl:'', slogan_ua:'', button_text:'', button_text_pl:'', button_text_ua:'', image_url:'' });
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({});

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }
  function login() { if (password === 'mitlar2026') setAuthed(true); else setMsg('Wrong password'); }

  useEffect(() => {
    if (!authed) return;
    supabase.from('sections').select('*').order('sort_order').then(({ data }) => { if (data) setSections(data); });
    supabase.from('hero').select('*').single().then(({ data }) => { if (data) setHero(data); });
    loadPosts();
  }, [authed]);

  async function loadPosts() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }

  async function handleToggleSection(key: string, cur: boolean) {
    await toggleSectionVisibility(key, cur);
    setSections(ss => ss.map(s => s.key === key ? { ...s, is_visible: !cur } : s));
    flash(`Section "${key}" ${cur ? 'hidden' : 'shown'} ✓`);
  }

  async function saveHero() {
    const fd = new FormData();
    Object.entries(hero).forEach(([k, v]) => fd.append(k, v ?? ''));
    await updateHero(fd);
    flash('Hero saved ✓');
  }

  async function handleSavePost(id: string, data: Partial<BlogPost>) {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, (v ?? '') as string));
    await updatePost(id, fd);
    await loadPosts();
    flash('Saved ✓');
  }

  async function handleCreatePost() {
    const fd = new FormData();
    Object.entries(newPost).forEach(([k, v]) => fd.append(k, (v ?? '') as string));
    await createPost(fd);
    setShowNew(false); setNewPost({});
    await loadPosts();
    flash('Post created ✓');
  }

  async function handleTogglePublish(id: string, cur: boolean) {
    await togglePublish(id, cur);
    setPosts(ps => ps.map(p => p.id === id ? { ...p, is_published: !cur } : p));
  }

  async function handlePin(id: string, pin: number | null) {
    await setPinPosition(id, pin); await loadPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete?')) return;
    await deletePost(id);
    setPosts(ps => ps.filter(p => p.id !== id));
  }

  function hf(key: keyof HeroData, label: string, multi = false) {
    return (
      <div className={styles.formGroup} key={key}>
        <label className={styles.label}>{label}</label>
        {multi
          ? <textarea className={styles.input} rows={2} value={hero[key] ?? ''} onChange={e => setHero(h => ({ ...h, [key]: e.target.value }))} />
          : <input className={styles.input} value={hero[key] ?? ''} onChange={e => setHero(h => ({ ...h, [key]: e.target.value }))} />}
      </div>
    );
  }

  function npf(key: keyof BlogPost, label: string, multi = false) {
    const val = (newPost[key] ?? '') as string;
    return (
      <div className={styles.formGroup} key={key}>
        <label className={styles.label}>{label}</label>
        {multi
          ? <textarea className={styles.input} rows={4} value={val} onChange={e => setNewPost(p => ({ ...p, [key]: e.target.value }))} />
          : <input className={styles.input} value={val} onChange={e => setNewPost(p => ({ ...p, [key]: e.target.value }))} />}
      </div>
    );
  }

  // Coming soon panel (for About, Equipment, Contacts)
  function ComingSoonPanel({ sectionKey }: { sectionKey: string }) {
    const sec = sections.find(s => s.key === sectionKey);
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{TAB_LABELS[sectionKey as TabKey]}</h2>
        </div>
        {sec && <SectionToggle section={sec} onToggle={handleToggleSection} />}
        <div className={styles.comingSoon}>
          <span>🚧</span>
          <p>Content management for this section is coming in the next release.</p>
        </div>
      </div>
    );
  }

  // ---- Login ----
  if (!authed) return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>Mitlar Admin</h1>
        <input className={styles.input} type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()} />
        <button className={styles.btn} onClick={login}>Enter</button>
        {msg && <p className={styles.msg}>{msg}</p>}
      </div>
    </div>
  );

  return (
    <div className={styles.adminWrap}>
      <header className={styles.adminHeader}>
        <span className={styles.adminLogo}>⚙ Mitlar Admin</span>
        <div className={styles.tabs}>
          {(Object.keys(TAB_LABELS) as TabKey[]).map(t => {
            const sec = sections.find(s => s.key === t);
            return (
              <button key={t}
                className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}
              >
                {TAB_LABELS[t]}
                {sec && !sec.is_visible && <span className={styles.hiddenDot} title="Hidden">●</span>}
              </button>
            );
          })}
        </div>
        <a href="/" className={styles.viewSite} target="_blank">View site →</a>
      </header>

      {msg && <div className={styles.flashMsg}>{msg}</div>}

      <div className={styles.adminBody}>

        {/* ===== HERO ===== */}
        {tab === 'hero' && (
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Hero Section</h2>
            {sections.find(s => s.key === 'hero') &&
              <SectionToggle section={sections.find(s => s.key === 'hero')!} onToggle={handleToggleSection} />}
            <div className={styles.langTabs}>
              {(['en','pl','ua'] as const).map(l => (
                <button key={l} className={`${styles.langTab} ${lang === l ? styles.langActive : ''}`} onClick={() => setLang(l)}>
                  {l === 'en' ? '🇬🇧 EN' : l === 'pl' ? '🇵🇱 PL' : '🇺🇦 UA'}
                </button>
              ))}
            </div>
            {lang === 'en' && <>{hf('slogan','Slogan (EN)',true)}{hf('button_text','Button (EN)')}{hf('image_url','Banner image URL')}</>}
            {lang === 'pl' && <>{hf('slogan_pl','Slogan (PL)',true)}{hf('button_text_pl','Button (PL)')}</>}
            {lang === 'ua' && <>{hf('slogan_ua','Slogan (UA)',true)}{hf('button_text_ua','Button (UA)')}</>}
            <button className={styles.btn} onClick={saveHero}>Save Hero</button>
          </div>
        )}

        {/* ===== ABOUT / EQUIPMENT / CONTACTS ===== */}
        {tab === 'about'    && <ComingSoonPanel sectionKey="about" />}
        {tab === 'equipment'&& <ComingSoonPanel sectionKey="equipment" />}
        {tab === 'contacts' && <ComingSoonPanel sectionKey="contacts" />}

        {/* ===== DEV BLOG ===== */}
        {tab === 'devblog' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Dev Blog</h2>
              <button className={styles.btnSm} onClick={() => setShowNew(s => !s)}>
                {showNew ? '✕ Cancel' : '+ New post'}
              </button>
            </div>
            {sections.find(s => s.key === 'devblog') &&
              <SectionToggle section={sections.find(s => s.key === 'devblog')!} onToggle={handleToggleSection} />}
            <div className={styles.langTabs}>
              {(['en','pl','ua'] as const).map(l => (
                <button key={l} className={`${styles.langTab} ${lang === l ? styles.langActive : ''}`} onClick={() => setLang(l)}>
                  {l === 'en' ? '🇬🇧 EN' : l === 'pl' ? '🇵🇱 PL' : '🇺🇦 UA'}
                </button>
              ))}
            </div>
            {showNew && (
              <div className={styles.postForm}>
                <p className={styles.formTitle}>New Post</p>
                {lang === 'en' && <>{npf('title','Title (EN)')}{npf('excerpt','Excerpt (EN)',true)}{npf('content','Content (EN)',true)}</>}
                {lang === 'pl' && <>{npf('title_pl','Title (PL)')}{npf('excerpt_pl','Excerpt (PL)',true)}{npf('content_pl','Content (PL)',true)}</>}
                {lang === 'ua' && <>{npf('title_ua','Title (UA)')}{npf('excerpt_ua','Excerpt (UA)',true)}{npf('content_ua','Content (UA)',true)}</>}
                <div className={styles.formActions}>
                  <button className={styles.btn} onClick={handleCreatePost}>Create</button>
                  <button className={styles.btnOutline} onClick={() => setShowNew(false)}>Cancel</button>
                </div>
              </div>
            )}
            <div className={styles.postsList}>
              {posts.map(post => (
                <PostRow key={post.id} post={post} lang={lang}
                  onTogglePublish={handleTogglePublish} onPin={handlePin}
                  onDelete={handleDelete} onSave={handleSavePost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
