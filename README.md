High-RPM, low-maintenance English calculator hub (SaaS metrics + paid ads) built with Next.js (App Router).

## Getting Started

Install and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Set these environment variables (optional but recommended):

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) for canonical URLs + sitemap (required in production)
- `NEXT_PUBLIC_ADSENSE_ENABLED=true` to load AdSense script
- `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx` your AdSense publisher id
- `NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR_SIDEBAR` ad slot id (calculator sidebar)
- `NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_BOTTOM` ad slot id (guide bottom)
- `NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID` ad slot id (home page)
- `NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_MID` ad slot id (category hubs)
- `NEXT_PUBLIC_ADSENSE_SLOT_GUIDES_INDEX_MID` ad slot id (guides index)
- `NEXT_PUBLIC_CONSENT_BANNER_ENABLED=false` (optional) to disable the cookie consent banner (enabled by default)

## AdSense checklist

- Update `public/ads.txt` with your real `pub-...` id before applying for AdSense.
- Copy `.env.example` to `.env.local` and set your real IDs.
- Keep `NEXT_PUBLIC_ADSENSE_ENABLED=false` until your AdSense account is approved.

## Structure

- Category hubs: `src/app/[category]/page.tsx`
- Calculator pages: `src/app/[category]/[slug]/page.tsx`
- Calculator definitions: `src/lib/calculators/definitions.ts`
- Policies: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`

## Build

```bash
npm run build
npm run start
```
