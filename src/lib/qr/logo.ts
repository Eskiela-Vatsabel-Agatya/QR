/** Decode + re-encode through canvas: strips EXIF/GPS. PNG/JPEG/WebP only, <=3 MB, <=512 px. */
export async function processLogo(file: File): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error('Gunakan gambar PNG, JPEG, atau WebP. SVG tidak diterima demi keamanan.');
  if (file.size > 3 * 1024 * 1024) throw new Error('Ukuran logo maksimal 3 MB.');
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file); } catch { throw new Error('Gambar tidak bisa dibaca.'); }
  const k = Math.min(1, 512 / Math.max(bmp.width, bmp.height)), cv = document.createElement('canvas');
  cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  cv.getContext('2d')!.drawImage(bmp, 0, 0, cv.width, cv.height); bmp.close();
  return cv.toDataURL('image/png');
}
