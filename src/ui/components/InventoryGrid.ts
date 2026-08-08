import { assert } from '../../core/Assert';
import { StateManager, type AppState } from '../../state/StateManager';
import { InventoryManager, type InventoryItem } from '../../data/InventoryManager';
import { I18nManager } from '../../core/I18n';
import { Logger } from '../../core/Logger';
import { BUSINESS } from '../../config';
import { MotionPreferences } from '../../core/MotionPreferences';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export class InventoryGrid {
    private container: HTMLElement;
    private stateManager: StateManager;
    private inventoryManager: InventoryManager;
    private i18nManager: I18nManager;

    constructor(stateManager: StateManager, inventoryManager: InventoryManager, i18nManager: I18nManager) {
        this.stateManager = stateManager;
        this.inventoryManager = inventoryManager;
        this.i18nManager = i18nManager;

        const containerEl = document.getElementById('inventory-grid-container');
        assert(containerEl !== null, 'inventory-grid-container must exist in the DOM');
        this.container = containerEl;

        this.stateManager.subscribe(this.onStateChange.bind(this));
    }

    private onStateChange(state: AppState): void {
        Logger.debug(`InventoryGrid reacting to state change: Category=${state.activeCategory}, Sort=${state.sortOrder}, Lang=${state.language}`);
        this.render(state);
    }

    public render(state: AppState): void {
        const items = this.inventoryManager.getItems(state.activeCategory, state.sortOrder);

        const flipState = Flip.getState('#inventory-grid-container > *', { props: 'opacity,transform' });
        this.container.innerHTML = '';

        if (items.length === 0) {
            this.container.innerHTML = `
                <div class="col-span-full flex justify-center items-center py-12 text-on-surface-variant font-body-lg">
                    No items found for the selected category.
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const article = this.createCard(item, state.language);
            fragment.appendChild(article);
        });

        this.container.appendChild(fragment);

        if (!MotionPreferences.reduced) {
            Flip.from(flipState, { duration: 0.5, ease: 'power2.out', stagger: 0.03, absolute: true });
        }

        const cards = this.container.querySelectorAll<HTMLElement>('.product-card');
        cards.forEach(card => this.revealSpecs(card));
    }

    private revealSpecs(cardElement: HTMLElement): void {
        const specLines = cardElement.querySelectorAll<HTMLElement>('[data-spec-line]');
        if (specLines.length === 0) return;

        if (MotionPreferences.reduced) {
            specLines.forEach((line) => { line.style.opacity = '1'; });
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                gsap.fromTo(
                    specLines,
                    { opacity: 0, x: -8 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' }
                );
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(cardElement);
    }

    private createCard(item: InventoryItem, lang: string): HTMLElement {
        const article = document.createElement('article');
        article.className = 'product-card bg-surface-container-high rounded-2xl border border-outline-variant overflow-hidden group flex flex-col @xl:flex-row h-full fade-in @container';

        const name = this.i18nManager.translate(item.nameKey, lang);
        const imageAlt = this.i18nManager.translate(item.imageAlt, lang);
        const btnText = this.i18nManager.translate('btn_inquire', lang);

        let badgeHtml = '';
        if (item.badge) {
            badgeHtml = `<div class="absolute top-4 right-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-md text-xs font-bold">${item.badge}</div>`;
        }

        let specsHtml = '';
        item.specs.forEach(spec => {
            const specText = this.i18nManager.translate(spec.key, lang);
            specsHtml += `
                <li class="flex items-start gap-2" data-spec-line>
                    <span class="material-symbols-outlined text-primary text-[18px] mt-0.5" data-icon="check_circle" data-weight="fill">check_circle</span>
                    <span>${specText}</span>
                </li>
            `;
        });

        const encodedMessage = encodeURIComponent(item.whatsappMessage);

        article.innerHTML = `
            <div class="relative h-64 @xl:h-auto flex-shrink-0 overflow-hidden bg-surface-bright p-4 @xl:w-5/12 flex items-center justify-center">
                <img src="${item.image}" alt="${imageAlt}" loading="lazy" width="400" height="400" class="w-full h-full object-contain mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 scale-95 group-hover:scale-100" />
                ${badgeHtml}
            </div>
            <div class="p-6 flex flex-col flex-grow @xl:w-7/12 @xl:justify-center">
                <h3 class="font-headline-md text-headline-md text-on-surface mb-4">${name}</h3>
                <ul class="flex flex-col gap-2 mb-6 font-body-md text-sm text-on-surface-variant">
                    ${specsHtml}
                </ul>
                <div class="mt-auto @xl:mt-6 pt-4 border-t border-outline-variant">
                    <a href="${BUSINESS.whatsappUrl}?text=${encodedMessage}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-surface text-primary border border-primary px-4 py-3 rounded-full font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
                        <span class="material-symbols-outlined text-xl" data-icon="chat" data-weight="fill">chat</span>
                        ${btnText}
                    </a>
                </div>
            </div>
        `;

        return article;
    }
}
