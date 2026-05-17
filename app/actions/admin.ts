'use server';

import { supabaseAdmin } from '../../lib/supabase-admin';
import { revalidatePath } from 'next/cache';

// ---- SECTIONS visibility ----
export async function toggleSectionVisibility(key: string, current: boolean) {
  const { error } = await supabaseAdmin
    .from('sections')
    .update({ is_visible: !current })
    .eq('key', key);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

// ---- HERO ----


export async function updateHero(formData: FormData) {
  const slogan       = formData.get('slogan')       as string;
  const slogan_pl    = formData.get('slogan_pl')    as string | null;
  const slogan_ua    = formData.get('slogan_ua')    as string | null;
  const button_text  = formData.get('button_text')  as string;
  const button_text_pl = formData.get('button_text_pl') as string | null;
  const button_text_ua = formData.get('button_text_ua') as string | null;
  const image_url    = formData.get('image_url')    as string | null;

  const { error } = await supabaseAdmin
    .from('hero')
    .update({ slogan, slogan_pl, slogan_ua, button_text, button_text_pl, button_text_ua, image_url })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // update all rows

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

// ---- BLOG POSTS ----

export async function createPost(formData: FormData) {
  const title      = formData.get('title')      as string;
  const title_pl   = formData.get('title_pl')   as string | null;
  const title_ua   = formData.get('title_ua')   as string | null;
  const excerpt    = formData.get('excerpt')    as string | null;
  const excerpt_pl = formData.get('excerpt_pl') as string | null;
  const excerpt_ua = formData.get('excerpt_ua') as string | null;
  const content    = formData.get('content')    as string | null;
  const content_pl = formData.get('content_pl') as string | null;
  const content_ua = formData.get('content_ua') as string | null;

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .insert({ title, title_pl, title_ua, excerpt, excerpt_pl, excerpt_ua, content, content_pl, content_ua, is_published: false });

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function updatePost(id: string, formData: FormData) {
  const title      = formData.get('title')      as string;
  const title_pl   = formData.get('title_pl')   as string | null;
  const title_ua   = formData.get('title_ua')   as string | null;
  const excerpt    = formData.get('excerpt')    as string | null;
  const excerpt_pl = formData.get('excerpt_pl') as string | null;
  const excerpt_ua = formData.get('excerpt_ua') as string | null;
  const content    = formData.get('content')    as string | null;
  const content_pl = formData.get('content_pl') as string | null;
  const content_ua = formData.get('content_ua') as string | null;

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({ title, title_pl, title_ua, excerpt, excerpt_pl, excerpt_ua, content, content_pl, content_ua })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function togglePublish(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({ is_published: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function setPinPosition(id: string, pin: number | null) {
  // Unpin any post that currently holds this position
  if (pin !== null) {
    await supabaseAdmin
      .from('blog_posts')
      .update({ pin_position: null })
      .eq('pin_position', pin);
  }
  // Set the new pin
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({ pin_position: pin })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function deletePost(id: string) {
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

// ---- CONTACTS ----

export async function updateContacts(formData: FormData) {
  const email     = formData.get('email')     as string;
  const phone     = formData.get('phone')     as string;
  const location  = formData.get('location')  as string;
  const instagram = formData.get('instagram') as string;
  const facebook  = formData.get('facebook')  as string;
  const youtube   = formData.get('youtube')   as string;
  const patreon   = formData.get('patreon')   as string;

  const { data: existing } = await supabaseAdmin.from('contacts').select('id').limit(1).single();

  if (existing) {
    const { error } = await supabaseAdmin
      .from('contacts')
      .update({ email, phone, location, instagram, facebook, youtube, patreon })
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from('contacts')
      .insert({ email, phone, location, instagram, facebook, youtube, patreon });
    if (error) throw new Error(error.message);
  }
  revalidatePath('/');
}
