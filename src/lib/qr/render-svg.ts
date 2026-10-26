import type { Grid } from './matrix';
export type Style = {
  fg: string; bg: string; transparent: boolean;
  shape: 'square' | 'rounded' | 'dots'; corner: 'square' | 'rounded';
  frame: 'none' | 'bar' | 'box'; label: string;
  logo?: { dataUri: string; mask: 'circle' | 'square' };
};
const Q = 4;
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const inFinder = (r: number, c: number, n: number) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

/** Logo box side in modules: <=20% of width, and cleared modules <=10% of all modules. */
export function logoBox(n: number) {
  let side = Math.max(1, Math.floor(n * 0.2));
  while (side > 1 && (side + 1) ** 2 > n * n * 0.1) side--;
  return side;
}
const rr = (x: number, y: number, w: number, k: number) =>
  `M${x + k} ${y}h${w - 2 * k}a${k} ${k} 0 0 1 ${k} ${k}v${w - 2 * k}a${k} ${k} 0 0 1 ${-k} ${k}h${-(w - 2 * k)}a${k} ${k} 0 0 1 ${-k} ${-k}v${-(w - 2 * k)}a${k} ${k} 0 0 1 ${k} ${-k}z`;

export function renderSvg(g: Grid, s: Style): string {
  const n = g.length, W = n + Q * 2, top = s.frame === 'box' ? 5 : 0, bot = s.frame === 'bar' ? 5 : 0;
  const pad = s.frame === 'none' ? 0 : 1, vw = W + pad * 2, vh = W + top + bot + pad * 2;
  const ox = Q + pad, oy = Q + pad + top;
  const side = s.logo ? logoBox(n) : 0, c0 = n / 2, half = side / 2 + 0.5;
  const cleared = (r: number, c: number) => !!s.logo && Math.abs(c + 0.5 - c0) < half && Math.abs(r + 0.5 - c0) < half;
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!g[r]![c] || inFinder(r, c, n) || cleared(r, c)) continue;
    const x = ox + c, y = oy + r;
    d += s.shape === 'square' ? `M${x} ${y}h1v1h-1z` : s.shape === 'rounded' ? rr(x, y, 1, 0.3)
      : `M${x + 0.04} ${y + 0.5}a0.46 0.46 0 1 0 0.92 0a0.46 0.46 0 1 0 -0.92 0z`;
  }
  for (const [fr, fc] of [[0, 0], [0, n - 7], [n - 7, 0]] as const) {
    const x = ox + fc, y = oy + fr;
    d += s.corner === 'rounded' ? rr(x, y, 7, 1.6) + rr(x + 1, y + 1, 5, 1) + rr(x + 2, y + 2, 3, 0.8)
      : `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  }
  const paper = s.transparent ? '#ffffff' : s.bg;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" shape-rendering="geometricPrecision">`;
  if (!s.transparent) out += `<rect width="${vw}" height="${vh}" fill="${s.bg}"/>`;
  if (s.frame !== 'none') {
    const fy = s.frame === 'bar' ? W + pad : pad;
    out += `<rect x="0.5" y="0.5" width="${vw - 1}" height="${vh - 1}" rx="1" fill="none" stroke="${s.fg}"/>`;
    out += `<rect x="0.5" y="${fy}" width="${vw - 1}" height="5" fill="${s.fg}"/>`;
    out += `<text x="${vw / 2}" y="${fy + 3.5}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="2.6" fill="${paper}">${esc(s.label)}</text>`;
  }
  out += `<path fill="${s.fg}" fill-rule="evenodd" d="${d}"/>`;
  if (s.logo) {
    const bx = ox + c0 - side / 2, by = oy + c0 - side / 2, p = 0.25;
    out += s.logo.mask === 'circle'
      ? `<circle cx="${bx + side / 2}" cy="${by + side / 2}" r="${side / 2 + p}" fill="${paper}"/>`
      : `<rect x="${bx - p}" y="${by - p}" width="${side + 2 * p}" height="${side + 2 * p}" rx="0.8" fill="${paper}"/>`;
    out += `<image href="${s.logo.dataUri}" x="${bx}" y="${by}" width="${side}" height="${side}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return out + '</svg>';
}
