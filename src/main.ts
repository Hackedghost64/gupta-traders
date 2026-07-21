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
        const i18nManager = new I18nManager();
        const stateManager = StateManager.getInstance();
        const uiManager = new UIManager(stateManager, i18nManager);
        
        // Initialize UI Orchestration
        uiManager.init();

        // Initialize Dynamic Data
        const inventoryManager = new InventoryManager();
        await inventoryManager.load();
        
        const inventoryGrid = new InventoryGrid(stateManager, inventoryManager, i18nManager);
        
        // Trigger initial render of the grid
        inventoryGrid.render(stateManager.getState());

        Logger.info('Application bootstrapped successfully.');
    } catch (e) {
        Logger.error('Critical failure during application bootstrap', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(e => Logger.error('Unhandled bootstrap error', e));
});
