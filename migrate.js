import fs from 'fs';
import { JSDOM } from 'jsdom';

const htmlContent = fs.readFileSync('../source/code.html', 'utf-8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Remove Tailwind config
const twScript = document.getElementById('tailwind-config');
if (twScript) twScript.remove();

// Add Vite main script
const moduleScript = document.createElement('script');
moduleScript.type = 'module';
moduleScript.src = '/src/main.ts';
document.body.appendChild(moduleScript);

// Extract text and add data-i18n
const enDict = {};
const hiDict = {};

let counter = 0;
function walk(node) {
    if (node.nodeType === 3) { // Text node
        const text = node.textContent.trim();
        if (text && text.length > 1 && !/^[0-9\W]+$/.test(text) && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
            const key = `str_${counter++}`;
            enDict[key] = text;
            hiDict[key] = `[HI] ${text}`; // Dummy Hindi translation
            
            // If parent only has text, add data-i18n to parent
            if (node.parentNode.childNodes.length === 1) {
                node.parentNode.setAttribute('data-i18n', key);
            } else {
                // Wrap in span
                const span = document.createElement('span');
                span.setAttribute('data-i18n', key);
                span.textContent = text;
                node.parentNode.replaceChild(span, node);
            }
        }
    } else if (node.nodeType === 1) {
        // Element node
        for (let i = 0; i < node.childNodes.length; i++) {
            walk(node.childNodes[i]);
        }
    }
}

walk(document.body);

// Also do it for nav links and buttons that might have been missed or have mixed content
// Actually walk() handles everything.

// Inject window.__LOCALES__
const localeScript = document.createElement('script');
localeScript.textContent = `window.__LOCALES__ = ${JSON.stringify({ en: enDict, hi: hiDict }, null, 2)};`;
document.head.appendChild(localeScript);

fs.writeFileSync('index.html', dom.serialize());
console.log('Migration complete. Dictionary size:', Object.keys(enDict).length);
