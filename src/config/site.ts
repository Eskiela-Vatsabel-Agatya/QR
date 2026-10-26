// The ONLY place for URLs, names and contacts.
export const SITE_URL = 'https://lunar-qr.workers.dev'; // VERIFY: replace with real URL after first deploy
export const MAIN_SITE_URL = 'https://www.lunarcreativa.workers.dev/'; // VERIFY
export const NAME = 'LunAR QR'; // VERIFY
export const WHATSAPP_URL = 'https://wa.me/6288216564572';
export const WHATSAPP_LABEL = '+62 882-1656-4572';
export const INSTAGRAM_URL = 'https://www.instagram.com/lunar_creativa/';
export const EMAIL = 'lunarcreativa@gmail.com';
export type Placement = 'header' | 'after-download' | 'home-card' | 'footer';
export const lead = (p: Placement) =>
  `${MAIN_SITE_URL}?utm_source=lunar-qr&utm_medium=referral&utm_campaign=${p}`;
