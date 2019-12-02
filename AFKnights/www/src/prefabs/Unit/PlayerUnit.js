import Prefab from '../Prefab';
import Unit from './Unit';
import PhysicalAttack from '../Attacks/PhysicalAttack';

class PlayerUnit extends Unit {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);

        this.face_texture = properties.face_texture;

        this.target_units = properties.target_units;
        this.attack = new PhysicalAttack(this.scene, this.name + "_attack", {x: 0, y: 0}, {group: "attacks", owner: this});
        
    }
    
    act () {

        this.scene.prefabs.show_player_unit.show(true);
        this.scene.prefabs.show_player_unit.change_current_unit(this, this.face_texture);
        
        this.scene.prefabs.actions_menu.enable(true);


        if(this.scene.AUTO){
            let target = this.choose_target();
            this.attack.hit(target);
        }
    }


    choose_target () {
        let target = undefined;
        let target_index = this.scene.rnd.between(0, this.scene.groups[this.target_units].countActive() - 1);
        let alive_enemy_unit_index = 0;
        this.scene.groups[this.target_units].children.each(function (unit) {
            if (unit.active) {
                if (alive_enemy_unit_index === target_index) {
                    target = unit;
                }
                alive_enemy_unit_index += 1;
            }
        }, this);
        return target;
    }
}

export default PlayerUnit;