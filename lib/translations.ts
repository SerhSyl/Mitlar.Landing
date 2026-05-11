export type Language = 'ua' | 'en' | 'pl';

export type Dictionary = {
  [key: string]: string;
};

export const translations: Record<Language, Dictionary> = {
  ua: {
    'nav.home': 'Головна',
    'nav.about': 'Про гру',
    'nav.equipment': 'Обладнання',
    'nav.devblog': 'Дев Блог',
    'nav.contact': 'Контакти',
    'btn.subscribe': 'Підписатись, щоб слідкувати',
    'btn.more': 'Читати далі',
    'btn.buy': 'Замовити',
    'equipment.draft': 'У чернетках',
    'equipment.priceTbd': 'Ціна уточнюється',
    'footer.rights': 'Mitlar. Всі права захищено.',
    'footer.privacy': 'Політика конфіденційності',
    'nav.menu': 'Меню',
    'hero.subtitle': 'Командна гра на моноколесах із gliding broom'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.equipment': 'Equipment',
    'nav.devblog': 'Dev Blog',
    'nav.contact': 'Contact',
    'btn.subscribe': 'Subscribe to follow',
    'btn.more': 'Read more',
    'btn.buy': 'Pre-order',
    'equipment.draft': 'Draft',
    'equipment.priceTbd': 'Price TBD',
    'footer.rights': 'Mitlar. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'nav.menu': 'MENU',
    'hero.subtitle': 'Team game on gliding broom'
  },
  pl: {
    'nav.home': 'Główna',
    'nav.about': 'O grze',
    'nav.equipment': 'Sprzęt',
    'nav.devblog': 'Dev Blog',
    'nav.contact': 'Kontakt',
    'btn.subscribe': 'Subskrybuj',
    'btn.more': 'Czytaj dalej',
    'btn.buy': 'Zamów',
    'equipment.draft': 'Szkic',
    'equipment.priceTbd': 'Cena wkrótce',
    'footer.rights': 'Mitlar. Wszelkie prawa zastrzeżone.',
    'footer.privacy': 'Polityka prywatności',
    'nav.menu': 'MENU',
    'hero.subtitle': 'Gra zespołowa na monocyklach z gliding broom'
  }
};
