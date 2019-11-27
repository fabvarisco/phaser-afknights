import Prefab from '../prefabs/Prefab';
import JSONLevelScene from "./JSONLevelScene";
import Unit from '../prefabs/Unit';
import MenuItem from '../prefabs/MenuItem'
import Menu from '../prefabs/Menu'

import PriorityQueue from '../../priority-queue.min.js';
class GameScene extends JSONLevelScene {

    constructor(){
        super('GameScene');

        this.prefab_classes ={
            background: Prefab.prototype.constructor,
            player_unit: Unit.prototype.constructor,
            enemy_unit: Unit.prototype.constructor,
            menu_item: MenuItem.prototype.constructor,
            menu: Menu.prototype.constructor
        }
        this.rnd = new Phaser.Math.RandomDataGenerator();

    }

    create () {
        super.create();
        
        this.units = new PriorityQueue({comparator: function (unit_a, unit_b) {
            return unit_a.act_turn - unit_b.act_turn;
        }});
        
        this.groups.player_units.children.each(function (unit) {
            unit.calculate_act_turn(0);
            this.units.queue(unit);
        }, this);
        
        this.groups.enemy_units.children.each(function (unit) {
            unit.calculate_act_turn(0);
            this.units.queue(unit);
        }, this);
        
        console.log(this.units);
        
        this.prefabs.actions_menu.enable(true);
        
        this.next_turn();
    }
    
    next_turn () {
        this.current_unit = this.units.dequeue();
        if (this.current_unit.active) {
            this.current_unit.act();
            this.current_unit.calculate_act_turn(this.current_unit.act_turn);
            this.units.queue(this.current_unit);
        } else {
            this.next_turn();
        }
    }
 
}
 
export default GameScene;