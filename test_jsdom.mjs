import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;
global.window = window;
global.document = window.document;

async function test() {
    const { I18nManager } = await import('./src/core/I18n.ts');
    const { StateManager } = await import('./src/state/StateManager.ts');
    const { UIManager } = await import('./src/ui/UIManager.ts');

    const i18nManager = new I18nManager();
    const stateManager = StateManager.getInstance();
    const uiManager = new UIManager(stateManager, i18nManager);
    
    uiManager.init();
    
    console.log("Initial Lang:", stateManager.getState().language);
    
    const headerToggle = document.querySelector('button[aria-label="Toggle Language"]');
    if (!headerToggle) throw new Error("Button not found!");
    
    headerToggle.click();
    
    console.log("After click Lang:", stateManager.getState().language);
    console.log("Slider after click:", document.getElementById('header-lang-slider')?.className);
    console.log("Text after click:", document.getElementById('header-lang-text')?.textContent);
}

test().catch(console.error);
