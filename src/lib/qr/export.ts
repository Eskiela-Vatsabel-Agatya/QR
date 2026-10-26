const stamp = () => { const d = new Date(), p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`; };
function save(blob: Blob, ext: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = `lunar-qr-${stamp()}.${ext}`; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const downloadSvg = (svg: string) => save(new Blob([svg], { type: 'image/svg+xml' }), 'svg');
export function downloadPng(svg: string, width: number): Promise<void> {
  return new Promise((res, rej) => {
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)!, h = Math.round((width * +vb[2]!) / +vb[1]!);
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = width; cv.height = h;
      cv.getContext('2d')!.drawImage(img, 0, 0, width, h); URL.revokeObjectURL(url);
      cv.toBlob((b) => (b ? (save(b, 'png'), res()) : rej()), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(); };
    img.src = url;
  });
}
