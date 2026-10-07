/**
 * En-têtes de sécurité HTTP — source unique pour Vite (dev/preview) et Vercel.
 * Après modification, exécutez : npm run headers:sync
 */

const CSP_PRODUCTION = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "media-src 'self' https: blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Vite + @vitejs/plugin-react inject an inline preamble for Fast Refresh (HMR).
// Without 'unsafe-inline', the browser blocks it and React throws "can't detect preamble".
const CSP_DEVELOPMENT = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co ws: wss: http://localhost:* http://127.0.0.1:*",
  "media-src 'self' https: blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SHARED_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "off",
};

/** @type {Record<string, string>} */
export const securityHeadersProduction = {
  ...SHARED_HEADERS,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": CSP_PRODUCTION,
};

/** @type {Record<string, string>} */
export const securityHeadersDevelopment = {
  ...SHARED_HEADERS,
  "Content-Security-Policy": CSP_DEVELOPMENT,
};

/** @param {Record<string, string>} headers */
export function toVercelHeaderEntries(headers) {
  return Object.entries(headers).map(([key, value]) => ({ key, value }));
}

export const vercelSecurityHeaderEntries =
  toVercelHeaderEntries(securityHeadersProduction);
