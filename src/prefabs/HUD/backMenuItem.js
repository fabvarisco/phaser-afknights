import Prefab from '../Prefab';
import MenuItem from './MenuItem';

 
class BackMenuItem extends MenuItem {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        
    }
    
    select () {
        this.scene.prefabs.actions_menu.enable(true);
        this.scene.prefabs.enemy_units_menu.enable(false);
        this.scene.prefabs.items_menu.enable(false);
        console.log(this.scene.prefabs.enemy_units_menu)

    }


}
 
export default BackMenuItem;
 