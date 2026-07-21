import { assert } from '../core/Assert';
import { StateManager, type AppState } from '../state/StateManager';
import { I18nManager } from '../core/I18n';
import { Logger } from '../core/Logger';

export class UIManager {
    private stateManager: StateManager;
    private i18nManager: I18nManager;

    constructor(stateManager: StateManager, i18nManager: I18nManager) {
        this.stateManager = stateManager;
        this.i18nManager = i18nManager;
    }

    public init(): void {
        Logger.info('UIManager initializing...');
        
        // Setup Event Listeners
        this.setupLanguageToggle();
        this.setupMobileMenuToggle();
        this.setupFilterUI();
        
        // Subscribe to State Changes
        this.stateManager.subscribe(this.onStateChange.bind(this));
        
        // Initial Render
        this.renderLanguage(this.stateManager.getState());
    }

    private setupLanguageToggle(): void {
        const headerToggle = document.querySelector('button[aria-label="Toggle Language"]');
        if (headerToggle) {
            headerToggle.addEventListener('click', () => {
                const currentState = this.stateManager.getState();
                const newLang = currentState.language === 'en' ? 'hi' : 'en';
                this.stateManager.setLanguage(newLang);
            });
        }

        const btnEn = document.getElementById('btn-en');
        const btnHi = document.getElementById('btn-hi');
        
        if (btnEn) {
            btnEn.addEventListener('click', () => this.stateManager.setLanguage('en'));
        }
        if (btnHi) {
            btnHi.addEventListener('click', () => this.stateManager.setLanguage('hi'));
        }
    }

    private setupMobileMenuToggle(): void {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.stateManager.toggleMobileMenu();
            });
        }
    }

    private setupFilterUI(): void {
        const filterBtn = document.querySelector('button:has([data-icon="filter_list"])');
        const filterModal = document.getElementById('filter-modal');
        const closeFilterBtn = document.getElementById('close-filter-btn');
        const filterOptions = document.querySelectorAll('.filter-option');

        if (filterBtn && filterModal) {
            filterBtn.addEventListener('click', () => {
                filterModal.classList.remove('hidden');
            });
        }

        if (closeFilterBtn && filterModal) {
            closeFilterBtn.addEventListener('click', () => {
                filterModal.classList.add('hidden');
            });
        }

        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const category = target.getAttribute('data-category');
                if (category) {
                    this.stateManager.setCategory(category);
                }
                if (filterModal) {
                    filterModal.classList.add('hidden');
                }
            });
        });
    }

    private onStateChange(state: AppState): void {
        this.renderLanguage(state);
        this.renderMobileMenu(state);
    }

    private renderLanguage(state: AppState): void {
        Logger.debug(`Re-rendering language nodes for: ${state.language}`);
        
        const textNodes = document.querySelectorAll('[data-i18n]');
        textNodes.forEach(node => {
            const key = node.getAttribute('data-i18n');
            assert(key !== null, 'data-i18n attribute cannot be null');
            
            try {
                const translatedText = this.i18nManager.translate(key, state.language);
                if (node.textContent !== translatedText) {
                    node.textContent = translatedText;
                }
            } catch (e) {
                Logger.error(`Translation failed for key: ${key}`, e);
            }
        });

        // Update Header Toggle Slider
        const headerSlider = document.getElementById('header-lang-slider');
        const headerText = document.getElementById('header-lang-text');
        if (headerSlider && headerText) {
            headerText.textContent = state.language.toUpperCase();
            if (state.language === 'hi') {
                headerSlider.classList.add('translate-x-6');
            } else {
                headerSlider.classList.remove('translate-x-6');
            }
        }

        // Update Mobile Toggle Slider
        const langSlider = document.getElementById('lang-slider');
        const btnEn = document.getElementById('btn-en');
        const btnHi = document.getElementById('btn-hi');
        
        if (langSlider && btnEn && btnHi) {
            if (state.language === 'hi') {
                langSlider.classList.add('translate-x-full');
                btnHi.classList.add('text-on-primary');
                btnHi.classList.remove('text-on-surface-variant');
                btnEn.classList.remove('text-on-primary');
                btnEn.classList.add('text-on-surface-variant');
            } else {
                langSlider.classList.remove('translate-x-full');
                btnEn.classList.add('text-on-primary');
                btnEn.classList.remove('text-on-surface-variant');
                btnHi.classList.remove('text-on-primary');
                btnHi.classList.add('text-on-surface-variant');
            }
        }
    }

    private renderMobileMenu(state: AppState): void {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            if (state.isMobileMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        }
    }
}
