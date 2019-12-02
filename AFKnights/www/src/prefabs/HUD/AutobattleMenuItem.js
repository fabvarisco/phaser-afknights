import Prefab from '../Prefab';
import MenuItem from './MenuItem';

 
class AutobattleMenuItem extends MenuItem {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        
    }
    
    select () {
        this.scene.AUTO = !this.scene.AUTO;

        this.scene.current_unit.act();
    }


}
 
export default AutobattleMenuItem;
 