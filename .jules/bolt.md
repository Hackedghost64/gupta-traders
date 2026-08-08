## 2024-05-24 - Throttling Scroll Event Listeners
**Learning:** The UI Manager had a synchronous scroll event listener that caused layout thrashing and main thread blocking on high-frequency scroll events due to direct DOM manipulation (`classList.toggle`).
**Action:** Use `requestAnimationFrame` to throttle scroll event handlers and always set `{ passive: true }` to improve scroll performance.
