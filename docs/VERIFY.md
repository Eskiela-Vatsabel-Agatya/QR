# VERIFY
1. Product name "LunAR QR".
2. Indonesian-only site language.
3. `MAIN_SITE_URL` = https://www.lunarcreativa.workers.dev/ is correct and public.
4. Real `SITE_URL` (placeholder `https://lunar-qr.workers.dev` also appears in `public/robots.txt`); replace both after first deploy.
5. Worker name `lunar-qr` matches the dashboard.
6. Dependency versions were chosen as the newest published 14+ days before 2026-10-26 (jsqr 1.4.0 is from 2021, the latest release).
7. `_headers` and Workers static assets syntax: not checked against current Cloudflare docs.
8. TEMP: `public/og-image.png` (1200x630) is missing and must be made.
9. Whether a QR-adjacent WhatsApp CTA is wanted beyond the LunAR card.
10. Logo clearing does not detect alignment patterns on large versions; rely on the 20% / 10% caps and ECC H, then scan-test.
