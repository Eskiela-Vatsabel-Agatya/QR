export type Result = { ok: true; value: string; warn?: string } | { ok: false; error: string };
const err = (error: string): Result => ({ ok: false, error });
export function buildUrl(raw: string): Result {
  let s = raw.trim();
  if (!s) return err('Masukkan tautan.');
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s) || /^[^/]*:\d+(\/|$)/.test(s)) s = 'https://' + s;
  let u: URL;
  try { u = new URL(s); } catch { return err('Tautan tidak valid.'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return err('Hanya tautan http:// atau https:// yang diterima.');
  return { ok: true, value: s, warn: s.length > 1000 ? 'URL panjang membuat kode lebih padat dan lebih sulit dipindai.' : undefined };
}
export const buildText = (raw: string): Result => (raw ? { ok: true, value: raw } : err('Masukkan teks.'));
export function normalizePhone(raw: string): string {
  let d = raw.replace(/[\s\-+().]/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
}
export function buildWhatsApp(phone: string, msg: string): Result {
  const d = normalizePhone(phone);
  if (!/^\d{8,15}$/.test(d)) return err('Nomor WhatsApp tidak valid.');
  return { ok: true, value: `https://wa.me/${d}` + (msg.trim() ? `?text=${encodeURIComponent(msg.trim())}` : '') };
}
const wifiEsc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
export function buildWifi(ssid: string, pass: string, sec: 'WPA' | 'WEP' | 'nopass', hidden: boolean): Result {
  if (!ssid) return err('Masukkan nama Wi-Fi (SSID).');
  if (sec !== 'nopass' && !pass) return err('Masukkan kata sandi Wi-Fi.');
  return { ok: true, value: `WIFI:T:${sec};S:${wifiEsc(ssid)};${sec === 'nopass' ? '' : `P:${wifiEsc(pass)};`}H:${hidden};;` };
}
