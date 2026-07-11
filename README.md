# Artisan Craft Services Website

Bilingual (English / French) marketing website for a craftsmanship business, built with Next.js 16, TypeScript, and Tailwind CSS.

## Pages

| Route | Description |
|-------|-------------|
| `/en` or `/fr` | Home — hero, categories, services, Google reviews |
| `/en/contact` | Contact form with file upload |
| `/en/portfolio` | Dynamic project gallery |
| `/en/admin` | Full content-management admin (login required) |

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Firebase values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/fr`.

The site renders from built-in default content even before Firebase is configured, so you can develop the UI without credentials. Editing content, uploading images, logging in, and sending contact emails all require Firebase.

## Dynamic content (Firebase-backed CMS)

All site content — hero, services, categories, portfolio, testimonials, contact
details, and copy — is stored in **Firestore**, images in **Firebase Storage**,
and admin login/password-reset in **Firebase Auth**. The built-in dictionaries
(`src/i18n/locales/{en,fr}.ts`) are the fallback defaults; Firestore values are
merged on top at request time (`src/i18n/get-dictionary.ts`, `src/lib/content.ts`).

### One-time Firebase setup

1. In the [Firebase console](https://console.firebase.google.com/project/artisan-craft-services), enable **Firestore**, **Storage**, and **Authentication → Email/Password**.
2. Copy the **web app config** into `.env.local` (the `NEXT_PUBLIC_FIREBASE_*` vars) and into `apphosting.yaml` for production.
3. For local dev + the seed script, generate a **service account key** (Project settings → Service accounts) and paste the JSON (single line) as `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local`. In production on App Hosting, credentials are provided automatically (no key needed).
4. Create the admin login user:
   ```bash
   node --env-file=.env.local scripts/seed-admin-user.mjs
   ```
   This creates `info@finitionpeinture.com` / `12345678` (or set `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`). You can also add the user manually in the console.

On first visit to `/admin` after signing in, Firestore collections are auto-seeded
from the defaults so every item is immediately editable.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON for local dev / seeding (blank in production) |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | Optional — Google Places live reviews |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO metadata |

## Admin panel

Visit `/en/admin` (or `/fr/admin`) and sign in with the admin email/password
(**Forgot password?** sends a Firebase reset email). Tabs let you manage:

- **Hero** — heading, CTA, background image, logo (EN/FR)
- **Services / Categories / Testimonials / Portfolio** — add, edit, delete, reorder, with EN/FR fields and image upload
- **Contact info** — hook, phone, email, hours, footer (EN/FR)
- **SMTP** — mail credentials used to deliver contact-form submissions

## Contact form email

Contact submissions (with photo attachments) are emailed via the SMTP
credentials configured in the admin **SMTP** tab (`src/lib/mail.ts`). Until SMTP
is configured, submissions return an error.

## Google Reviews

Testimonials are admin-managed by default. The optional Google Places
integration (`GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID`) remains available in
`src/lib/reviews.ts` for the "Leave a review" link.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **i18n:** Custom EN/FR dictionary system with Firestore overrides
- **Images:** `next/image` + Firebase Storage uploads
- **Data:** Firestore (content, services, categories, portfolio, testimonials, settings)
- **Auth:** Firebase Authentication (email/password + reset) with server session cookies
- **Email:** Nodemailer (admin-configurable SMTP)

## Deploy to Firebase App Hosting

Firebase project: **artisan-craft-services**  
Console: https://console.firebase.google.com/project/artisan-craft-services/overview

App Hosting requires the **Blaze (pay-as-you-go)** plan. Upgrade here:  
https://console.firebase.google.com/project/artisan-craft-services/usage/details

After upgrading to Blaze:

```bash
# 1. Create the App Hosting backend (one-time)
firebase apphosting:backends:create \
  --project artisan-craft-services \
  --backend craft-services-web \
  --primary-region us-central1 \
  --root-dir .

# 2. Deploy
npm run deploy:firebase
```

Config files: `firebase.json`, `.firebaserc`, `apphosting.yaml`

Update `NEXT_PUBLIC_SITE_URL` in `apphosting.yaml` after the first deploy with your live App Hosting URL.


```
src/
  app/[locale]/     # Localized pages (home, contact, portfolio, admin)
  app/api/          # content, services, categories, testimonials, portfolio,
                    #   settings/smtp, contact, admin (login/logout/upload/seed)
  components/       # UI components
  components/admin/ # Admin panel + section editors
  i18n/             # Translation dictionaries (defaults) + Firestore merge
  lib/              # firebase/, content, portfolio, settings, mail, storage, auth
scripts/
  seed-admin-user.mjs  # one-time admin user creation
firestore.rules, storage.rules  # locked to server-only access
public/images/      # default WebP images
```
