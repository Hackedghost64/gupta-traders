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
            Logger.info('Fetching local catalog data...');
            const response = await fetch(`${import.meta.env.BASE_URL}data/inventory.json`);
            assert(response.ok, `Failed to load inventory data: ${response.statusText}`);
            
            const localData = await response.json();
            assert(Array.isArray(localData), 'Inventory data must be an array');
            this.items = [...localData] as InventoryItem[];
            this.isLoaded = true;
            Logger.info(`Loaded ${this.items.length} base inventory items.`);

            // Connect live with Pump Dekho Firestore database
            await this.syncLiveFirestoreCatalog();
        } catch (error) {
            Logger.error('Error fetching inventory data', error);
            throw error;
        }
    }

    private async syncLiveFirestoreCatalog(): Promise<void> {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 3000);

            const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/staff-app-0037243-id/databases/(default)/documents/products?pageSize=50';
            const res = await fetch(firestoreUrl, { signal: controller.signal });
            clearTimeout(timer);

            if (!res.ok) return;

            const json = await res.json();
            const docs = json.documents || [];
            if (!Array.isArray(docs) || docs.length === 0) return;

            const existingIds = new Set(this.items.map(item => item.id));
            const liveItems: InventoryItem[] = [];

            for (const doc of docs) {
                const docId = doc.name ? doc.name.split('/').pop() : '';
                if (!docId || existingIds.has(docId)) continue;

                const f = doc.fields || {};
                const name = f.name?.stringValue || '';
                if (!name) continue;

                const price = f.price?.integerValue ? Number(f.price.integerValue) : (f.price?.doubleValue ? Number(f.price.doubleValue) : 0);
                const category = (f.category?.stringValue || '').toLowerCase();
                const brand = f.brand?.stringValue || '';
                const section = f.section?.stringValue || null;
                const images = f.imageUrls?.arrayValue?.values || [];
                const imageUrl = images.length > 0 && images[0].stringValue ? images[0].stringValue : './assets/pump.webp';

                let categoryId = 'pumps';
                if (category.includes('pipe')) categoryId = 'pipes';
                else if (category.includes('mill') || category.includes('chakki')) categoryId = 'milling';
                else if (category.includes('harvest')) categoryId = 'harvester';
                else if (category.includes('tiller')) categoryId = 'tiller';

                const specsList: InventorySpec[] = [];
                if (f.specs?.mapValue?.fields) {
                    const fields = f.specs.mapValue.fields as Record<string, { stringValue?: string; integerValue?: string | number } | undefined>;
                    for (const [k, v] of Object.entries(fields)) {
                        const val = v?.stringValue || v?.integerValue || '';
                        if (val) specsList.push({ key: `${k}: ${val}` });
                    }
                }

                liveItems.push({
                    id: docId,
                    categoryId,
                    nameKey: name,
                    price,
                    badge: section === 'trending' ? '🔥 Trending' : (brand || 'In Stock'),
                    specs: specsList.length > 0 ? specsList : [{ key: `${brand} Genuine Hardware` }],
                    image: imageUrl,
                    imageAlt: name,
                    whatsappMessage: `Hi Gupta Traders, I am interested in ${name} (₹${price}) from your catalog.`,
                });
            }

            if (liveItems.length > 0) {
                this.items = [...liveItems, ...this.items];
                Logger.info(`Successfully synced ${liveItems.length} live products from Pump Dekho Firestore.`);
            }
        } catch (e) {
            Logger.info('Live Firestore catalog sync skipped, running on offline catalog.', e);
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
                    break;
            }
        }

        return filteredItems;
    }
}
