import Prefab from './Prefab';
import Unit from './Unit';

class PlayerUnit extends Unit {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
    }
 
    act () {
        this.scene.prefabs.actions_menu.enable(true);
    }
 
}

export default PlayerUnit;