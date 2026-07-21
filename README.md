# Gupta Traders Digital Showroom

This is a B2B Lead Generation Hub optimized for rapid loading and LLM search visibility. The core objective is converting digital traffic into direct WhatsApp or phone inquiries, focusing on the heavy machinery and agricultural sectors.

## Strict Architecture (TypeScript OOP)

This codebase enforces a Strict Object-Oriented paradigm. Monolithic scripts and ad-hoc DOM manipulations have been actively rejected in favor of state-driven orchestrators.

### Core Philosophy
1. **Zero Hardcoded UI Text**: Core application text binds dynamically to an `I18nManager` reading from static memory.
2. **Static Object Injection for SEO**: The dictionaries (`en` and `hi`) are statically injected into `window.__LOCALES__` via the `index.html` payload at build/render time. This bypasses client-side asynchronous network fetching specifically for text data, ensuring instantaneous read access for web crawlers while preserving the client-side OOP switching mechanism.
3. **Defensive Programming**: A robust `Assert.ts` utility wraps critical DOM selectors and business logic, providing fail-fast guarantees instead of silent rendering errors.
4. **Trace Debugging**: A `Logger.ts` abstraction encapsulates output streams, explicitly preventing raw `console.log()` usage and allowing environment-aware muting in production.

## State Data Flow

1. **User Interaction**: User triggers a toggle via the UI (e.g., clicks the EN/HI language button).
2. **State Mutation**: The event listener inside `UIManager` invokes the Singleton `StateManager` (e.g., `stateManager.setLanguage('hi')`).
3. **Subscription Notification**: `StateManager` broadcasts the updated state tree (the active language and mobile menu status) to all subscribers.
4. **Active Rendering Orchestration**: `UIManager`, listening for these mutations, re-scans the DOM for elements containing `data-i18n` attributes.
5. **Localization Extraction**: `UIManager` queries `I18nManager.translate(key, language)`. `I18nManager` executes assertions against the `window.__LOCALES__` payload, enforcing a fallback to English if necessary.
6. **DOM Update**: The target text nodes are securely re-rendered with the new language data without full page layout recalculation or jank.

## Tech Stack
*   **HTML5 Semantic Layer** (for Web Crawler accessibility)
*   **Vite** (Build tooling)
*   **TypeScript** (`strict: true`, explicit definitions required, `verbatimModuleSyntax`)
*   **Tailwind CSS v3** (Utility-first styling with static configuration)

## Development Workflow

### Requirements
*   Node.js

### Setup
```bash
npm install
npm run dev
```

### Git Strategy
We enforce strict conventional commits corresponding to architectural checkpoints:
- `feat: scaffolding`
- `feat: core-utilities`
- `feat: i18n-migration`
- `feat: ui-orchestration`
