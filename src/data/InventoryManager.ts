import { Logger } from '../core/Logger';
import { assert } from '../core/Assert';

export interface InventorySpec {
    key: string;
}

export interface InventoryItem {
    id: string;
    categoryId: string;
    nameKey: string;
    price: number;
    badge: string | null;
    specs: InventorySpec[];
    image: string;
    imageAlt: string;
    whatsappMessage: string;
}

export class InventoryManager {
    private items: InventoryItem[] = [];
    private isLoaded: boolean = false;

    public async load(): Promise<void> {
        if (this.isLoaded) return;
        
        try {
            Logger.info('Fetching inventory data...');
            const response = await fetch(`${import.meta.env.BASE_URL}data/inventory.json`);
            assert(response.ok, `Failed to load inventory data: ${response.statusText}`);
            
            const data = await response.json();
            assert(Array.isArray(data), 'Inventory data must be an array');
            
            this.items = data as InventoryItem[];
            this.isLoaded = true;
            Logger.info(`Loaded ${this.items.length} inventory items.`);
        } catch (error) {
            Logger.error('Error fetching inventory data', error);
            throw error;
        }
    }

    public getItems(categoryId: string | null, sortOrder: string | null): InventoryItem[] {
        assert(this.isLoaded, 'Cannot get items before inventory is loaded.');

        let filteredItems = this.items;

        if (categoryId && categoryId !== 'all') {
            filteredItems = filteredItems.filter(item => item.categoryId === categoryId);
        }

        // Sort a copy so filtering and sorting never mutate the original data.
        if (sortOrder) {
            filteredItems = [...filteredItems];
            switch (sortOrder) {
                case 'price-asc':
                    filteredItems.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredItems.sort((a, b) => b.price - a.price);
                    break;
                default:
                    // Unknown sort order, do nothing
                    break;
            }
        }

        return filteredItems;
    }
}
