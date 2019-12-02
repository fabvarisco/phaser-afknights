import Prefab from '../Prefab';
import Unit from './Unit';

class PlayerUnit extends Unit {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);

        this.face_texture = properties.face_texture;
    }
    
    act () {
        this.scene.prefabs.show_player_unit.show(true);
        this.scene.prefabs.show_player_unit.change_current_unit(this, this.face_texture);
        
        this.scene.prefabs.actions_menu.enable(true);
    }
 
}

export default PlayerUnit;