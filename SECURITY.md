# Security Policy

## Supported Versions

This is a personal portfolio site. The current production deployment is the only supported version.

## Reporting a Vulnerability

If you discover a security issue in this site or any linked project, please report it privately to **lakin.finn@gmail.com**. Do not open a public GitHub issue.

You should expect a response within 5 business days. Please include:

- A short description of the issue and its impact
- Steps to reproduce
- Any proof-of-concept code or URLs (kept confidential)

## What this site does and does not collect

- **Analytics:** none. No third-party trackers, no cookies, no fingerprinting scripts.
- **Forms:** none. All contact happens via `mailto:` / `tel:` links — no data is submitted to a server from this site.
- **Storage:** no `localStorage`, `sessionStorage`, or `IndexedDB` is used.
- **External requests:** Google Fonts (CSS + WOFF2), jsDelivr (Chart.js), and the local Finance Analyser API at `127.0.0.1:8000`. All other requests are blocked by the site's Content Security Policy.

## Hardening in place

| Control | Mechanism |
|---|---|
| **HTTPS-only in production** | Enforced at the host / CDN level (Strict-Transport-Security `max-age=31536000; includeSubDomains; preload`) |
| **Content Security Policy** | Strict CSP declared via `<meta http-equiv>`; restricts script, style, font, image and frame origins |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` + `frame-ancestors 'self'` |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` |
| **Referrer** | `Referrer-Policy: strict-origin-when-cross-origin` |
| **Powerful APIs** | `Permissions-Policy` disables camera, mic, geo, payment, USB, motion sensors |
| **Third-party JS integrity** | Chart.js loaded from jsDelivr with `integrity="sha384-…"` and `crossorigin="anonymous"` |
| **Open-Redirect protection** | No server-side redirects; all anchors are `target="_blank" rel="noopener noreferrer"` for external links |
| **Secrets in repo** | `.env` and any credential file is `.gitignore`'d; no API keys are embedded in client-side code |
| **Dev artefacts excluded** | `.superpowers/`, `for-claude-design.html`, helper scripts excluded from deploy |

## Finance Analyser API (when deployed publicly)

When the FastAPI analyser is moved off `localhost`:

1. CORS will be locked down to the portfolio's exact origin (not `*`)
2. Rate limiting (10 req/min/IP) will be enabled on `/api/query` and `/api/analyze`
3. The Anthropic API key remains server-side only and is never exposed to the browser
4. Request bodies will be capped at 8KB and validated through Pydantic

## What to do before you publish

Before pushing the site live, run through:

- [ ] Confirm `.env` and any credential files are listed in `.gitignore`
- [ ] Confirm dev artefacts (`.superpowers/`, `for-claude-design.html`, `claude-design-brief.html`) are gitignored
- [ ] Set HTTP security headers at the host/CDN layer (Cloudflare / Vercel / Netlify all support this in their dashboard)
- [ ] Move all CDN-loaded scripts to SRI-verified loads
- [ ] Replace the local `127.0.0.1:8000` Finance Analyser URL in `js/main.js` (`DEMO_URL`) with the production HTTPS endpoint
- [ ] Update CSP `frame-src` and `connect-src` to allow only the deployed analyser host
