import fs from 'fs';
import { JSDOM } from 'jsdom';

const htmlContent = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// 1. Remove hardcoded product cards and insert container
const articles = Array.from(document.querySelectorAll('article'));
if (articles.length > 0) {
    const parent = articles[0].parentNode;
    const container = document.createElement('div');
    container.id = 'inventory-grid-container';
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full';
    
    // Insert container before first article
    parent.insertBefore(container, articles[0]);
    
    // Remove old articles
    articles.forEach(article => article.remove());
}

// 2. Add Filter Modal HTML
const filterModal = document.createElement('div');
filterModal.id = 'filter-modal';
filterModal.className = 'hidden fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm';
filterModal.innerHTML = `
<div class="bg-surface-container-high p-6 rounded-2xl border border-outline-variant w-11/12 max-w-md shadow-2xl">
    <div class="flex justify-between items-center mb-6">
        <h3 class="font-headline-md text-on-surface" data-i18n="filter_title">Filter Inventory</h3>
        <button id="close-filter-btn" class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="flex flex-col gap-4">
        <button class="filter-option text-left px-4 py-3 rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors" data-category="all" data-i18n="filter_all">All Equipment</button>
        <button class="filter-option text-left px-4 py-3 rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors" data-category="harvester" data-i18n="filter_harvester">Harvesters</button>
        <button class="filter-option text-left px-4 py-3 rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors" data-category="milling" data-i18n="filter_milling">Milling Machines</button>
        <button class="filter-option text-left px-4 py-3 rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors" data-category="tiller" data-i18n="filter_tiller">Rotary Tillers</button>
    </div>
</div>
`;
document.body.appendChild(filterModal);

// 3. Update Locales script block
const scripts = Array.from(document.querySelectorAll('script'));
const localeScript = scripts.find(s => s.textContent.includes('window.__LOCALES__'));

if (localeScript) {
    const match = localeScript.textContent.match(/window\.__LOCALES__\s*=\s*({[\s\S]+});/);
    if (match) {
        const locales = JSON.parse(match[1]);
        
        // Add new keys
        const newKeys = {
            'prod_1_name': 'GT-900 High-Yield Combine Harvester',
            'prod_1_spec_1': 'Engine Power: 250 HP Turbocharged',
            'prod_1_spec_2': 'Grain Tank Capacity: 8,000 Liters',
            'prod_1_spec_3': 'Cutting Width: 4.5 Meters',
            'prod_1_alt': 'A sleek, modern agricultural harvester machine',
            'prod_2_name': 'Industrial Flour Mill Pro-X',
            'prod_2_spec_1': 'Output Capacity: 5 Tons/Hour',
            'prod_2_spec_2': 'Material: 304 Stainless Steel Core',
            'prod_2_spec_3': 'Power Consumption: 45kW 3-Phase',
            'prod_2_alt': 'A heavy-duty industrial flour milling machine',
            'prod_3_name': 'Heavy-Duty Rotary Tiller RX',
            'prod_3_spec_1': 'Working Width: 2.2 Meters',
            'prod_3_spec_2': 'Blades: 60 L-Type Boron Steel',
            'prod_3_spec_3': 'Tractor Required: 55-75 HP',
            'prod_3_alt': 'A rugged tractor-mounted rotary tiller',
            'prod_4_name': 'Compact Rotary Tiller',
            'prod_4_spec_1': 'Working Width: 1.5 Meters',
            'prod_4_spec_2': 'Blades: 42 L-Type Boron Steel',
            'prod_4_spec_3': 'Tractor Required: 35-50 HP',
            'prod_4_alt': 'A compact tractor-mounted rotary tiller',
            'filter_title': 'Filter Inventory',
            'filter_all': 'All Equipment',
            'filter_harvester': 'Harvesters',
            'filter_milling': 'Milling Machines',
            'filter_tiller': 'Rotary Tillers',
            'btn_inquire': 'Inquire via WhatsApp'
        };

        for (const [k, v] of Object.entries(newKeys)) {
            locales.en[k] = v;
            locales.hi[k] = '[HI] ' + v;
        }

        localeScript.textContent = `window.__LOCALES__ = ${JSON.stringify(locales, null, 2)};`;
    }
}

fs.writeFileSync('index.html', dom.serialize());
console.log('DOM update complete.');
