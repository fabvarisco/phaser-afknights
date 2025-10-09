import Prefab from '../Prefab';
import MenuItem from './MenuItem';

class ItemMenuItem extends MenuItem {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        this.item_name = properties.item_name;
    }
    
    select () {
        if (this.scene.cache.game.player_data.inventory.has_item(this.item_name)) {
            this.scene.prefabs.items_menu.enable(false);

            this.scene.cache.game.player_data.inventory.use_item(this.item_name, this.scene.current_unit);
            this.scene.prefabs.show_player_unit.update_stats();

            if (!this.scene.cache.game.player_data.inventory.has_item(this.item_name)) {
                let scene = this.scene;
                this.destroy();
                scene.nextTurn();
            } else {
                this.scene.nextTurn();
            }
        }
    }
}

export default ItemMenuItem;
