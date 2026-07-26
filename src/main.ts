import './style.css';
import { Logger } from './core/Logger';
import { I18nManager } from './core/I18n';
import { StateManager } from './state/StateManager';
import { UIManager } from './ui/UIManager';
import { InventoryManager } from './data/InventoryManager';
import { InventoryGrid } from './ui/components/InventoryGrid';

async function bootstrap(): Promise<void> {
    Logger.info('Application bootstrapping started.');

    try {
        // Create the small services used by the page. Keeping startup here
        // makes it easy to see how the application is assembled.
        const i18nManager = new I18nManager();
        const stateManager = StateManager.getInstance();
        const uiManager = new UIManager(stateManager, i18nManager);

        uiManager.init();

        const inventoryManager = new InventoryManager();
        await inventoryManager.load();

        const inventoryGrid = new InventoryGrid(stateManager, inventoryManager, i18nManager);
        inventoryGrid.render(stateManager.getState());

        Logger.info('Application bootstrapped successfully.');
    } catch (e) {
        Logger.error('Critical failure during application bootstrap', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(e => Logger.error('Unhandled bootstrap error', e));
});
