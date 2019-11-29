import Prefab from './Prefab';
import Attack from './Attack';
import Unit from './Unit';

class EnemyUnit extends Unit {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
 
        this.target_units = properties.target_units;
 
        this.attack = new Attack(this.scene, this.name + "_attack", {x: 0, y: 0}, {group: "attacks", owner: this});
    }
 
    choose_target () {
        let target = undefined;
        let target_index = this.scene.rnd.between(0, this.scene.groups[this.target_units].countActive() - 1);
        let alive_player_unit_index = 0;
        this.scene.groups[this.target_units].children.each(function (unit) {
            if (unit.active) {
                if (alive_player_unit_index === target_index) {
                    target = unit;
                }
                alive_player_unit_index += 1;
            }
        }, this);
        return target;
    }
 
    act () {
        let target = this.choose_target();
    
        this.attack.hit(target);
    }
 
}

export default EnemyUnit;