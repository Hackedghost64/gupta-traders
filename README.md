# Gupta Traders Website

This is a small Vite + TypeScript website for Gupta Traders. It is a mostly
static business website with a product catalog, Hindi/English language switch,
filters, sorting, WhatsApp contact buttons, and an embedded Google Map.

## Start the website

Install dependencies once:

```text
npm install
```

Run the local development server:

```text
npm run dev
```

Create a production build:

```text
npm run build
```

## Where to edit things

| Task | File |
| --- | --- |
| Page sections, headings, links, and tables | `index.html` |
| Products, prices, images, and WhatsApp messages | `public/data/inventory.json` |
| Product card layout | `src/ui/components/InventoryGrid.ts` |
| Button behavior and menus | `src/ui/UIManager.ts` |
| Current language, filter, and sort state | `src/state/StateManager.ts` |
| English and Hindi translation lookup | `src/core/I18n.ts` and the locale data in `index.html` |
| Business phone, WhatsApp, map, and support settings | `src/config.ts` |
| Colors, fonts, animations, and Tailwind imports | `src/style.css` and `tailwind.config.js` |
| Application startup | `src/main.ts` |

## How the code fits together

```text
index.html
	├── Displays the page structure and locale text
	└── Loads src/main.ts

src/main.ts
	├── Starts UIManager
	├── Loads inventory.json through InventoryManager
	└── Asks InventoryGrid to render product cards

UIManager
	├── Connects buttons to click handlers
	├── Updates translations
	└── Shows and hides the mobile menu and filter modal

StateManager
	└── Stores language, category, sort order, and menu state

InventoryGrid
	└── Converts each inventory item into a product card
```

## Common edits

### Add or change a product

Edit `public/data/inventory.json`. Keep the existing property names. Product
images should be placed in `public/assets/` and referenced like:

```json
"image": "/assets/my-machine.jpg"
```

### Change the business contact details

Edit `src/config.ts`. This keeps the WhatsApp number and map link in one place
for TypeScript-generated links and buttons. Some static HTML links still have
their own `href`; update those too when changing business details.

### Change the design

Most visual styling is written directly as Tailwind classes in `index.html`.
For example, `bg-primary` controls the main green color and `rounded-full`
creates pill-shaped buttons. Global styles and animations are in
`src/style.css`.

## Important notes

- Edit the source files, not the generated `dist/` folder.
- Product cards are generated from `inventory.json`; they are intentionally not
	copied into `index.html`.
- Translation text is kept in `index.html` so the initial page has readable
	content before TypeScript starts.
- The old root-level migration scripts are historical utilities. They are not
	part of the normal development or build process.
