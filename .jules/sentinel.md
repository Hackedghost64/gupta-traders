## 2024-08-08 - [XSS vulnerability via innerHTML in createCard]
**Vulnerability:** XSS vulnerability in src/ui/components/InventoryGrid.ts due to unescaped data from translation and inventory JSON being inserted directly into DOM via innerHTML.
**Learning:** In frontend templates (even without React/Vue/Angular), assigning untrusted data (like translations or API payloads) directly to innerHTML can lead to XSS. dompurify is a good solution to sanitize HTML strings.
**Prevention:** Use DOMPurify before inserting dynamic HTML content with innerHTML, or create DOM elements manually (using textContent for text).
