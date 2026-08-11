# Gupta Traders — Website

Opinionated brief and developer notes for the Gupta Traders site (Vite + TypeScript + Tailwind).

## Quick start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## What this repo contains

- `index.html` — Static page shell, locale strings, and hero markup.
- `public/data/inventory.json` — Product catalog data (source of truth for product cards).
- `public/assets/` — Images and static assets referenced by the site.
- `src/` — TypeScript app (UI wiring, state, inventory loader, and components).
  - `src/main.ts` — App bootstrapper.
  - `src/ui/UIManager.ts` — Page interactions, menus, and animation setup.
  - `src/ui/components/InventoryGrid.ts` — Renders product cards from the inventory.
  - `src/state/StateManager.ts` — App state (language, filters, sort, menus).
  - `src/core/I18n.ts` — Translation helper.
  - `src/style.css` — Tailwind imports and project-level CSS.

## Editing content

- Add products or update prices in `public/data/inventory.json`.
- Place new product images into `public/assets/` and reference them with `/assets/<name>`.
- Update business contact and map in `src/config.ts`.
- Translate or tweak default copy in `index.html` (the page includes initial locale strings so it degrades gracefully when JS is disabled).

## Animations & startup

- The hero intro is implemented inline in `index.html` using GSAP. Reveal-on-scroll is implemented in `src/ui/UIManager.ts` using `IntersectionObserver`.
- If you change the hero markup, check the `splitHeadline` helper in `index.html` which splits headlines by `<br>` to stagger lines.
- `src/core/MotionPreferences.ts` — single source of truth for `prefers-reduced-motion`; every animation class checks it before running tweens.
- `src/ui/components/StatCounter.ts` — animates numeric stat cards (10k+, 25 Yrs) into view via ScrollTrigger on scroll.
- `src/ui/components/ParticleField.ts` — lightweight canvas particle field behind the hero photo; rAF starts/stops with IntersectionObserver to save CPU off-screen.
- `src/ui/components/PressureGauge.ts` — SVG needle gauge in the pipes section; rotates on table row hover, parsing kgf/cm² and PN values from inline text.
- `src/ui/components/RouteDraw.ts` — decorative stroke-dashoffset route line drawn over the Google Maps embed when the location section enters viewport.
- `src/ui/components/InventoryGrid.ts` — GSAP Flip animates card positions on filter/sort changes; `[data-spec-line]` stagger reveals spec lines on card scroll-intersection.
- `src/ui/UIManager.ts` — language toggle crossfades all `[data-i18n]` elements; `#pipes tbody tr` rows reveal staggered via CSS transition on IntersectionObserver.

## Development notes

- This project uses Vite as the dev server and build tool; TypeScript configuration is in `tsconfig.json`.
- Tailwind configuration is in `tailwind.config.js` and PostCSS config is `postcss.config.js`.

## Git and deployment

1. Create a GitHub repository (if not already created).
2. Add a remote and push:

```bash
git remote add origin <git@github.com:youruser/yourrepo.git>
git branch -M main
git push -u origin main
```

## Continuous integration

This repository includes a GitHub Actions workflow that:

- installs Node.js and dependencies
- runs ESLint, TypeScript type checking, and HTML validation
- builds the app with `npm run build`
- deploys `dist/` to GitHub Pages on pushes to `main` (via the official `actions/deploy-pages`)

The workflow is defined in `.github/workflows/ci.yml` and publishes the site to GitHub Pages using the Actions-based deployment source. No extra configuration is needed once Pages is enabled for the repository.

## Troubleshooting

- If animations don't run on reload, check `index.html` for the GSAP intro logic and `src/ui/UIManager.ts` for scroll reveal handling.
- For asset load issues, verify paths under `public/assets/` and ensure images are referenced with absolute `/assets/...` paths.

## License

This repository does not include a license file. Add a `LICENSE` if you intend to open-source the repo.

---

If you want, I can also create a minimal `.github/workflows/ci.yml` to build and deploy automatically, or push these changes to a GitHub repo — provide the repo URL or let me know if you want me to create one with the GitHub CLI.
