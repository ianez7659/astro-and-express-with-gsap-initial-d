# Initial D Web Client (Astro)

Astro-based frontend application.  
It communicates with an Express + Supabase backend and uses GSAP animations with TypeScript.

**Live Demo:** [`https://astro-and-express-with-gsap-initial.vercel.app/`](https://astro-and-express-with-gsap-initial.vercel.app/)

**Demo Account:** `demo@example.com` / `demo1234`

## Structure (inside `client/`)

```
client/
├── src/
│   ├── pages/          # Route pages (/signup, /dashboard, /user, ...)
│   ├── components/     # Reusable Astro components
│   ├── layout/         # Common layouts (main, protected pages, etc.)
│   ├── services/       # Backend API calls (TypeScript)
│   ├── scripts/        # GSAP and form-handling scripts (TypeScript)
│   └── styles/         # Global styles
├── public/             # Static assets (images, audio, etc.)
└── package.json        # Astro client package configuration
```

> Note: The animation scripts that used to live under `public/js/*.js`  
> now live under `src/scripts/*.ts` and are bundled via TypeScript + Vite.

## Frontend Stack

- **Astro 5**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **GSAP 3**: Intro and page-transition animations

## Install & Run

### 1. Install dependencies

```bash
# From the project root
cd client
npm install
```

### 2. Run in development mode

```bash
# Astro dev server (default: http://localhost:4321)
cd client
npm run dev
```

To use the backend APIs properly, **run the Express server in another terminal**:

```bash
cd server
npm install   # first time only
npm run dev   # default: http://localhost:3000
```

### 3. Production build & preview

```bash
cd client
npm run build    # create dist
npm run preview  # preview the built site locally
```

## Main Pages

- `/`           : Main / Login + intro animation
- `/signup`     : Sign up
- `/dashboard`  : Dashboard (protected)
- `/user`       : Profile management (name, phone, address, profile picture)
- `/contact`    : Contact form
- `/forgot`     : Forgot password request
- `/reset`      : Password reset (token based)

## Auth & Session

- JWT-based auth (issued in backend, stored/used in frontend)
+- Session timer + auto-logout dialog
- Login info/token handling in `src/services/sessionstorage.ts`

## Animation Scripts

- `src/scripts/page-anim.ts`
  - Runs GSAP enter animations for elements with `data-anim`, `data-delay`, `data-duration`
  - Animates background elements (`bg-layer`, `bg-inner-image`) and form elements in sequence
- `src/scripts/page-transition.ts`
  - Provides `window.navigateWithFade(href)` global function
  - Before navigation: slides out form elements and fades out background, then updates `window.location.href`
- `src/scripts/profile-handler.ts`
  - Handles `profile-form` submission on the `/user` page
  - Calls the profile update API in Supabase (currently mocked with console logs)

These scripts are loaded from each page like this:

```astro
<!-- Example: user.astro -->
<script type="module" src="/src/scripts/page-anim.ts"></script>
<script type="module" src="/src/scripts/profile-handler.ts"></script>
```

At build time, Vite rewrites these URLs to bundled JS files.

## References

- For the full architecture and backend/DB details, see the root `PROJECT_DESCRIPTION.md`.
- For Vercel deployment and serverless entrypoints, see the root `vercel.json` and `api/index.js`.
