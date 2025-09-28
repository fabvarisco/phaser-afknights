import PhysicalAttack from '../Attacks/PhysicalAttack';
import Unit from './Unit';

class EnemyUnit extends Unit {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.name = name;
        this.position = position;
        this.properties = properties;
        this.target_units = properties.target_units;
        this.setTexture(this.properties.texture)
        console.log("name", this.name)
        this.attack = new PhysicalAttack(this.scene, this.name + "_attack", {x: 0, y: 0}, {group: "attacks", owner: this});
        console.log("this", this)
        this.type = "enemy_unit";
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
        //this.scene.prefabs.show_player_unit.show(false);

        let target = this.choose_target();
    
        this.attack.hit(target);
    }

    destroy(){
        if(this.active){
            //TODO - verificar pq crashou
            let menu_item = this.scene.prefabs[this.name + '_item'];
            console.log("menu_item", menu_item);
            //menu_item.destroy();
            super.destroy();
        }
    }
 
}

export default EnemyUnit;