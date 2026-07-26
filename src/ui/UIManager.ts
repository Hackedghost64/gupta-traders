import { assert } from '../core/Assert';
import { StateManager, type AppState } from '../state/StateManager';
import { I18nManager } from '../core/I18n';
import { Logger } from '../core/Logger';
import { BUSINESS } from '../config';

export class UIManager {
    private stateManager: StateManager;
    private i18nManager: I18nManager;
    private lastFocusedElement: HTMLElement | null = null;

    constructor(stateManager: StateManager, i18nManager: I18nManager) {
        this.stateManager = stateManager;
        this.i18nManager = i18nManager;
    }

    public init(): void {
        Logger.info('UIManager initializing...');

        // Keep all page interactions in one readable place. The HTML supplies
        // IDs and classes; these methods supply the behavior.
        this.setupLanguageToggle();
        this.setupMobileMenuToggle();
        this.setupFilterUI();
        this.setupSortUI();
        this.setupCatalogButton();
        this.setupPageActions();
        this.setupAnimations();
        
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

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const state = this.stateManager.getState();
                if (state.isMobileMenuOpen) {
                    this.stateManager.toggleMobileMenu();
                }
            });
        });
    }

    private setupSortUI(): void {
        const sortBtn = document.getElementById('sort-btn');
        if (!sortBtn) return;

        sortBtn.addEventListener('click', () => {
            const currentOrder = this.stateManager.getState().sortOrder;
            const nextOrder = currentOrder === null
                ? 'price-asc'
                : currentOrder === 'price-asc'
                    ? 'price-desc'
                    : null;
            this.stateManager.setSortOrder(nextOrder);
            sortBtn.setAttribute('aria-label', nextOrder === 'price-asc'
                ? 'Sorted by price, lowest first'
                : nextOrder === 'price-desc'
                    ? 'Sorted by price, highest first'
                    : 'Sort inventory');
        });
    }

    private setupPageActions(): void {
        const directionsLink = document.getElementById('directions-link');
        directionsLink?.setAttribute('href', BUSINESS.mapUrl);

        const supportButton = document.getElementById('support-button');
        supportButton?.addEventListener('click', () => {
            window.open(BUSINESS.whatsappUrl, '_blank', 'noopener,noreferrer');
        });

        const header = document.getElementById('top-navbar');
        window.addEventListener('scroll', () => {
            header?.classList.toggle('shadow-md', window.scrollY > 20);
        });

        const filterModal = document.getElementById('filter-modal');
        filterModal?.addEventListener('click', event => {
            if (event.target === filterModal) {
                this.closeFilterModal();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.closeFilterModal();
                if (this.stateManager.getState().isMobileMenuOpen) {
                    this.stateManager.toggleMobileMenu();
                }
            }
        });
    }

    private setupAnimations(): void {
        document.body.classList.add('js-enabled');

        const sections = document.querySelectorAll('main section, body > section');
        sections.forEach(section => section.classList.add('reveal-on-scroll'));

        // Reveal sections as they enter the viewport instead of animating the
        // entire page on load. The fallback keeps content visible in older
        // browsers without IntersectionObserver.
        if (!('IntersectionObserver' in window)) {
            sections.forEach(section => section.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

        sections.forEach(section => observer.observe(section));
    }

    private setupCatalogButton(): void {
        const catalogBtn = document.getElementById('view-catalog-btn');
        if (!catalogBtn) return;

        catalogBtn.addEventListener('click', () => {
            this.stateManager.setCategory('all');
            document.getElementById('inventory-grid-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    private setupFilterUI(): void {
        const filterBtn = document.getElementById('filter-btn');
        const filterModal = document.getElementById('filter-modal');
        const closeFilterBtn = document.getElementById('close-filter-btn');
        const filterOptions = document.querySelectorAll('.filter-option');

        if (filterBtn && filterModal) {
            filterBtn.addEventListener('click', () => {
                this.openFilterModal(filterModal, filterBtn);
            });
        }

        if (closeFilterBtn && filterModal) {
            closeFilterBtn.addEventListener('click', () => {
                this.closeFilterModal();
            });
        }

        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const category = target.getAttribute('data-category');
                if (category) {
                    this.stateManager.setCategory(category);
                }
                this.closeFilterModal();
            });
        });
    }

    private openFilterModal(modal: HTMLElement, trigger: HTMLElement): void {
        this.lastFocusedElement = trigger;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        modal.querySelector<HTMLElement>('button')?.focus();
    }

    private closeFilterModal(): void {
        const modal = document.getElementById('filter-modal');
        if (!modal || modal.classList.contains('hidden')) return;

        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        this.lastFocusedElement?.focus();
        this.lastFocusedElement = null;
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

        // Update the header language switch.
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

        // Update the mobile language switch.
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
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenu) {
            if (state.isMobileMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = '';
            }

            const icon = mobileMenuBtn?.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = state.isMobileMenuOpen ? 'close' : 'menu';
            mobileMenuBtn?.setAttribute('aria-expanded', String(state.isMobileMenuOpen));
            mobileMenuBtn?.setAttribute('aria-label', state.isMobileMenuOpen ? 'Close menu' : 'Open menu');
        }
    }
}
