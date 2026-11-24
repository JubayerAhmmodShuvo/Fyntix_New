# Fyntix — Vercel deployment project

This ZIP contains the corrected Fyntix website source, including the restored Stories section, bundled images/fonts, current metadata and legal pages. It is configured for a Vercel build with Node.js 24.x.

## Deploy with Vercel

Unzip first. This is a Vercel project folder, not a ZIP that Vercel automatically imports as a hosted site.

Option A — CLI:

1. Open a terminal in the extracted folder.
2. Run `npx vercel@latest --prod`.
3. Sign in to your Vercel account and create/link your own project when prompted.

Option B — dashboard:

1. Put the extracted project in a new Git repository in your own account.
2. Import that repository in Vercel.
3. Use the Vite preset, Node.js 24.x, install command `npm ci`, build command `npm run build`, and output directory `dist`.

The supplied vercel.json includes these build settings and trailing-slash routing. No ChatGPT project identity, Vercel account identity or deployment credentials are included.

## Public URL and SEO

The prebuild script uses SITE_URL if you set it. Otherwise it uses Vercel's VERCEL_PROJECT_PRODUCTION_URL, then VERCEL_URL. This updates canonical URLs, social URLs, internal absolute links, sitemap and AI-readable exports before building.

For a custom domain, set SITE_URL in the Vercel project to your final public origin, for example `https://www.your-domain.com`, then redeploy. Ensure Vercel's system environment variables are exposed to the build. Do not leave https://fyntix.example as the published canonical origin.

Manual equivalent:

`node scripts/configure-origin.mjs https://www.your-domain.com`

## Local build

- Node.js 24.x
- `npm ci`
- `npm run build`
- `npm run preview`
- Checks after a build: `node --test scripts/privacy-metadata.test.mjs`

## Existing functionality

The source builds 91 static routes. Existing pages use generated route files; unknown URLs should stay 404 rather than all rewriting to the homepage. Images and fonts are bundled. Vimeo videos require internet access and permission in Cookie settings. Contact is info@fyntix.com; enquiry/application forms are not connected to a submission backend.

Deployment documentation:
https://vercel.com/docs/cli/deploy
https://vercel.com/docs/builds/configure-a-build
https://vercel.com/docs/environment-variables/system-environment-variables
