# Langkah untuk kamu
1. Buat repo GitHub, push branch `main`.
2. Cloudflare dashboard > Workers & Pages > Create > import repo (Workers Builds). Production branch `main`, build `npm run build`, deploy `npx wrangler deploy`. Nama Worker harus sama dengan `wrangler.jsonc` (`lunar-qr`).
3. Setelah deploy pertama, salin URL `*.workers.dev` dan ganti `SITE_URL` di `src/config/site.ts` serta baris Sitemap di `public/robots.txt`.
4. Buka situs, buat kode, pindai dengan HP, dan cek tab Network (lihat /privasi).
5. Nanti: beli domain, tambahkan sebagai Custom Domain di Worker, ubah `SITE_URL`, deploy ulang.
Branch fitur mendapat URL pratinjau; cek sebelum merge ke `main`.
