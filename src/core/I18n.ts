import { assert } from './Assert';

declare global {
    interface Window {
        __LOCALES__: Record<string, Record<string, string>>;
    }
}

export class I18nManager {
    private locales: Record<string, Record<string, string>>;

    constructor() {
        assert(
            typeof window !== 'undefined' && typeof window.__LOCALES__ !== 'undefined',
            'window.__LOCALES__ must be defined for I18nManager to initialize.'
        );
        this.locales = window.__LOCALES__;
    }

    public translate(key: string, lang: string): string {
        assert(typeof key === 'string' && key.length > 0, 'Translate key must be a non-empty string.');
        assert(typeof lang === 'string' && lang.length > 0, 'Translate lang must be a non-empty string.');

        const langDict = this.locales[lang];
        if (langDict && langDict[key]) {
            return langDict[key];
        }

        // Fallback to English
        const enDict = this.locales['en'];
        if (enDict && enDict[key]) {
            return enDict[key];
        }

        // If key is a literal text or dynamically loaded catalog item, return key gracefully
        return key;
    }
}
