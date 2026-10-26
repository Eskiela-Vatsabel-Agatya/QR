# DECISIONS
- Font: Plus Jakarta Sans (one family, weights 400 and 700, latin), self-hosted via @fontsource. Exported SVG labels use system sans-serif, so the label may look different from the site font.
- CSS is one file (`src/styles/app.css`) instead of three.
- Hosting: Workers static assets, no Worker script (not yet checked against current docs).
- Frames: "bar bawah" and "label atas" only; no PDF/EPS export.
- Design: follows design.md v2 soft-UI variant. Containers and the preview card are raised, the inset "well" is available for inputs areas, controls and CTAs stay flat with 1px borders (>=3:1), the QR tile is flat white. Logos are inlined (not `<img>`). Font sizes fixed at 14/16/20/32/42/64. `npm run contrast` checks every colour pair.
- design.md parts not used (no products, 3D or AR on this site): sections 8 and 8a.
