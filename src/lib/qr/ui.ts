import { buildUrl, buildText, buildWhatsApp, buildWifi, type Result } from './payloads';
import { makeMatrix } from './matrix';
import { renderSvg, type Style } from './render-svg';
import { ratio, isHex, isLighter } from './contrast';
import { processLogo } from './logo';
import { downloadPng, downloadSvg } from './export';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const val = (id: string) => $<HTMLInputElement>(id).value;
let logoUri: string | undefined, svgOut = '', raf = 0;

function payload(): Result {
  switch (val('type')) {
    case 'url': return val('url').trim() ? buildUrl(val('url')) : { ok: false, error: '' };
    case 'text': return val('text') ? buildText(val('text')) : { ok: false, error: '' };
    case 'wa': return val('wa-n').trim() ? buildWhatsApp(val('wa-n'), val('wa-m')) : { ok: false, error: '' };
    default: return val('w-s') ? buildWifi(val('w-s'), val('w-p'), val('w-t') as 'WPA', $<HTMLInputElement>('w-h').checked) : { ok: false, error: '' };
  }
}
function say(id: string, text: string, cls = '') { const e = $(id); e.textContent = text; e.className = 'msg ' + cls; }

function update() {
  document.querySelectorAll<HTMLElement>('[data-t]').forEach((d) => (d.hidden = d.dataset.t !== val('type')));
  $('count').textContent = `${val('text').length} / 1000`;
  const p = payload(), prev = $('preview'), tr = $<HTMLInputElement>('tr').checked;
  prev.classList.toggle('board', tr);
  ['png', 'svg'].forEach((b) => ($<HTMLButtonElement>(b).disabled = true));
  svgOut = ''; say('pmsg', ''); say('msg', p.ok ? p.warn ?? '' : p.error, p.ok ? 'w' : 'e');
  $('rm').hidden = !logoUri; say('ecc', logoUri ? 'Koreksi kesalahan: H (karena ada logo)' : 'Koreksi kesalahan: M');
  const fg = val('fg'), bg = val('bg');
  if (!p.ok) { prev.replaceChildren(Object.assign(document.createElement('span'), { textContent: 'Isi data untuk melihat kode.' })); return; }
  if (!isHex(fg) || !isHex(bg)) { say('pmsg', 'Warna harus berformat #RRGGBB.', 'e'); return; }
  const m = makeMatrix(p.value, logoUri ? 'H' : 'M');
  if (!m) { say('msg', 'Isi terlalu panjang untuk dimuat dalam satu kode QR.', 'e'); return; }
  const style: Style = {
    fg, bg, transparent: tr, shape: val('shape') as Style['shape'], corner: val('corner') as Style['corner'],
    frame: val('frame') as Style['frame'], label: val('label').slice(0, 20),
    logo: logoUri ? { dataUri: logoUri, mask: val('mask') as 'circle' | 'square' } : undefined,
  };
  const r = ratio(fg, tr ? '#FFFFFF' : bg); let block = false, note = '';
  if (r < 3) { block = true; note = 'Kontras terlalu rendah (di bawah 3:1), ekspor diblokir.'; }
  else if (r < 4.5) note = 'Kontras rendah, kode mungkin sulit dipindai.';
  if (!tr && isLighter(fg, bg)) note += ' Kode terbalik (terang di atas gelap) tidak terbaca oleh sebagian pemindai lama.';
  if (tr) note += ' Latar transparan: kode hanya terbaca di atas permukaan terang.';
  svgOut = renderSvg(m, style);
  const doc = new DOMParser().parseFromString(svgOut, 'image/svg+xml').documentElement;
  prev.replaceChildren(document.importNode(doc, true));
  say('pmsg', note.trim(), block ? 'e' : 'w');
  ['png', 'svg'].forEach((b) => ($<HTMLButtonElement>(b).disabled = block));
}
const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };

document.getElementById('controls')!.addEventListener('input', schedule);
document.getElementById('controls')!.addEventListener('change', schedule);
const sw = $('sw');
for (const c of ['#0B1220', '#2A57FF', '#000000', '#14532D', '#7F1D1D']) {
  const b = document.createElement('button'); b.type = 'button'; b.style.background = c; b.setAttribute('aria-label', `Warna ${c}`);
  b.onclick = () => { $<HTMLInputElement>('fg').value = c; schedule(); }; sw.append(b);
}
$<HTMLInputElement>('logo').addEventListener('change', async (e) => {
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
  try { logoUri = await processLogo(f); say('msg', ''); } catch (x) { say('msg', (x as Error).message, 'e'); }
  schedule();
});
$('rm').onclick = () => { logoUri = undefined; $<HTMLInputElement>('logo').value = ''; schedule(); };
$('reset').onclick = () => { document.querySelectorAll<HTMLInputElement>('#controls input,#controls textarea').forEach((i) => { i.type === 'checkbox' ? (i.checked = false) : i.type !== 'file' ? (i.value = i.defaultValue) : (i.value = ''); }); logoUri = undefined; schedule(); };
const done = () => ($('after').hidden = false);
$('svg').onclick = () => { if (svgOut) { downloadSvg(svgOut); done(); } };
$('png').onclick = () => { if (svgOut) downloadPng(svgOut, +val('size')).then(done, () => say('pmsg', 'Gagal membuat PNG.', 'e')); };
$('close').onclick = () => ($('after').hidden = true);
update();
