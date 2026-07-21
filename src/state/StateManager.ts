type Language = 'en' | 'hi';

export interface AppState {
    language: Language;
    isMobileMenuOpen: boolean;
    activeCategory: string | null;
    sortOrder: string | null;
}

type Subscriber = (state: AppState) => void;

export class StateManager {
    private static instance: StateManager | null = null;
    private state: AppState;
    private subscribers: Subscriber[] = [];

    private constructor() {
        this.state = {
            language: 'en',
            isMobileMenuOpen: false,
            activeCategory: 'all',
            sortOrder: null,
        };
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public getState(): AppState {
        return this.state;
    }

    public setLanguage(language: Language): void {
        this.state.language = language;
        this.notifySubscribers();
    }

    public toggleMobileMenu(): void {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        this.notifySubscribers();
    }

    public setCategory(category: string | null): void {
        this.state.activeCategory = category;
        this.notifySubscribers();
    }

    public setSortOrder(order: string | null): void {
        this.state.sortOrder = order;
        this.notifySubscribers();
    }

    public subscribe(callback: Subscriber): () => void {
        this.subscribers.push(callback);
        // Return an unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers(): void {
        for (const subscriber of this.subscribers) {
            subscriber(this.state);
        }
    }
}
