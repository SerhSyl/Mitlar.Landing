import { supabase } from '../lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';
import Hero from './components/Hero';
import DevBlog from './components/DevBlog';
import Contact from './components/Contact';
import About from './components/About';
import Equipment from './components/Equipment';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mitlar — Team game on the gliding broom',
  description: 'Mitlar is a new team sport played on monowheels with specially designed gliding brooms. Follow our development journey.',
};

async function getSectionVisibility(): Promise<Record<string, boolean>> {
  noStore();
  const { data, error } = await supabase
    .from('sections')
    .select('key, is_visible');
  if (error || !data) {
    return { hero: true, devblog: true, contacts: true };
  }
  return Object.fromEntries(data.map(s => [s.key, s.is_visible]));
}

export default async function Home() {
  const vis = await getSectionVisibility();
  const showHero      = vis['hero']      === true;
  const showAbout     = vis['about']     === true;
  const showEquipment = vis['equipment'] === true;
  const showDevBlog   = vis['devblog']   === true;
  const showContacts  = vis['contacts']  === true;

  return (
    <main>
      {showHero      && <section id="hero"><Hero /></section>}
      {showAbout     && <section id="about"><About /></section>}
      {showEquipment && <section id="equipment"><Equipment /></section>}
      {showDevBlog   && <section id="devblog"><DevBlog /></section>}
      {showContacts  && <Contact />}
    </main>
  );
}
