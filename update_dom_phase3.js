import fs from 'fs';
import { JSDOM } from 'jsdom';

const htmlContent = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// 1. Add Sections before Footer
const footer = document.querySelector('footer');
if (footer) {
    const parent = footer.parentNode;
    
    // Hardware Section
    const hardwareSection = document.createElement('section');
    hardwareSection.id = 'hardware';
    hardwareSection.className = 'py-stack-lg px-gutter max-w-container-max mx-auto scroll-mt-24';
    hardwareSection.innerHTML = `
        <div class="mb-stack-md text-center max-w-prose mx-auto">
            <h2 class="font-display-md text-display-md text-on-surface mb-4">Heavy-Duty Hardware</h2>
            <p class="font-body-lg text-on-surface-variant">Industrial grade nuts, bolts, and mounting brackets engineered for high-tension environments.</p>
        </div>
        <div class="bg-surface-container-high rounded-3xl border border-outline-variant p-8 flex flex-col items-center justify-center min-h-[300px]">
            <span class="material-symbols-outlined text-6xl text-primary mb-4" data-icon="hardware" data-weight="fill">handyman</span>
            <p class="font-headline-sm text-on-surface">Full catalog coming soon</p>
        </div>
    `;
    parent.insertBefore(hardwareSection, footer);

    // Specifications Section
    const specsSection = document.createElement('section');
    specsSection.id = 'specifications';
    specsSection.className = 'py-stack-lg px-gutter max-w-container-max mx-auto scroll-mt-24';
    specsSection.innerHTML = `
        <div class="mb-stack-md text-center max-w-prose mx-auto">
            <h2 class="font-display-md text-display-md text-on-surface mb-4">Technical Specifications</h2>
            <p class="font-body-lg text-on-surface-variant">Compare material grades and structural integrities across our product lines.</p>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-outline-variant">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container-high border-b border-outline-variant">
                        <th class="p-4 font-headline-sm text-on-surface">Material</th>
                        <th class="p-4 font-headline-sm text-on-surface">Tensile Strength</th>
                        <th class="p-4 font-headline-sm text-on-surface">Warranty</th>
                    </tr>
                </thead>
                <tbody class="bg-surface">
                    <tr class="border-b border-outline-variant">
                        <td class="p-4 text-on-surface-variant">304 Stainless Steel</td>
                        <td class="p-4 text-on-surface-variant">505 MPa</td>
                        <td class="p-4 text-on-surface-variant">10 Years</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-on-surface-variant">Boron Steel (Blades)</td>
                        <td class="p-4 text-on-surface-variant">1,400 MPa</td>
                        <td class="p-4 text-on-surface-variant">3 Years</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    parent.insertBefore(specsSection, footer);

    // Support Section
    const supportSection = document.createElement('section');
    supportSection.id = 'support';
    supportSection.className = 'py-stack-lg px-gutter max-w-container-max mx-auto scroll-mt-24 bg-surface-container-lowest rounded-3xl border border-outline-variant my-stack-lg';
    supportSection.innerHTML = `
        <div class="flex flex-col md:flex-row gap-12 items-center">
            <div class="flex-1">
                <h2 class="font-display-md text-display-md text-on-surface mb-6">24/7 Priority Support</h2>
                <p class="font-body-lg text-on-surface-variant mb-8">Downtime is expensive. Our field engineering team is on standby to ensure your heavy machinery remains operational.</p>
                <a href="mailto:support@guptatraders.com" class="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-lg hover:bg-primary/90 transition-colors">
                    <span class="material-symbols-outlined" data-icon="support_agent">support_agent</span>
                    Contact Support
                </a>
            </div>
            <div class="flex-1 flex justify-center">
                <div class="w-full max-w-sm aspect-square bg-surface-container-high rounded-full border border-outline-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-8xl text-primary/20" data-icon="engineering">engineering</span>
                </div>
            </div>
        </div>
    `;
    parent.insertBefore(supportSection, footer);
}

// 2. Enhance Language Toggle UI
// We will replace the old EN and HI buttons with a unified toggle pill
const oldEnBtn = document.querySelector('button[data-i18n="str_16"]');
const oldHiBtn = document.querySelector('button[data-i18n="str_17"]');

if (oldEnBtn && oldHiBtn) {
    const parentContainer = oldEnBtn.parentNode;
    // Clear parent container and insert our new sleek toggle
    parentContainer.innerHTML = '';
    
    // We'll create a single pill container
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'relative flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant w-32 h-10 shadow-sm overflow-hidden isolate';
    
    // The animated sliding background indicator
    toggleContainer.innerHTML = `
        <div id="lang-slider" class="absolute left-1 top-1 w-[calc(50%-4px)] h-8 bg-primary rounded-full transition-transform duration-300 ease-out z-0 translate-x-0"></div>
        <button id="btn-en" class="flex-1 relative z-10 text-on-primary font-label-md transition-colors duration-300">EN</button>
        <button id="btn-hi" class="flex-1 relative z-10 text-on-surface-variant font-label-md transition-colors duration-300">HI</button>
    `;
    
    parentContainer.appendChild(toggleContainer);
}

// Ensure the old toggle button on the header is also updated or hidden if we moved it.
// The old toggle button in the header was <button aria-label="Toggle Language">
const headerToggle = document.querySelector('button[aria-label="Toggle Language"]');
if (headerToggle) {
    headerToggle.innerHTML = `
        <div class="relative w-14 h-8 bg-surface-container-high border border-outline-variant rounded-full flex items-center p-1">
            <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-on-primary transition-transform duration-300" id="header-lang-slider">
                <span id="header-lang-text">EN</span>
            </div>
        </div>
    `;
    // We remove some generic classes so our new UI fits
    headerToggle.className = 'hidden md:flex items-center justify-center transition-colors group';
}


fs.writeFileSync('index.html', dom.serialize());
console.log('DOM enhancements complete.');
