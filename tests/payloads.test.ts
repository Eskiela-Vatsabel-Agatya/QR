import { describe, it, expect } from 'vitest';
import { buildUrl, buildWhatsApp, buildWifi } from '../src/lib/qr/payloads';
describe('payloads', () => {
  it('rejects bad schemes', () => { for (const s of ['javascript:alert(1)', 'data:text/html,x', ' JAVASCRIPT:alert(1)', 'vbscript:x']) expect(buildUrl(s).ok).toBe(false); });
  it('adds https', () => expect(buildUrl('contoh.com')).toMatchObject({ ok: true, value: 'https://contoh.com' }));
  it('normalises WhatsApp', () => { for (const n of ['0812345678', '+62 812345678', '62812345678']) expect(buildWhatsApp(n, '')).toMatchObject({ value: 'https://wa.me/62812345678' }); });
  it('escapes wifi', () => expect(buildWifi('a;b', 'p:"', 'WPA', false)).toMatchObject({ value: 'WIFI:T:WPA;S:a\\;b;P:p\\:\\";H:false;;' }));
});
