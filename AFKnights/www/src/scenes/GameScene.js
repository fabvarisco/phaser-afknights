import Prefab from '../prefabs/Prefab';
import JSONLevelScene from "./JSONLevelScene";
import Unit from '../prefabs/Unit/Unit';
import MenuItem from '../prefabs/HUD/MenuItem'
import PhysicalAttackMenuItem from '../prefabs/HUD/PhysicalAttackMenuItem'
import MagicalAttackMenuItem from '../prefabs/HUD/MagicalAttackMenuItem'
import Menu from '../prefabs/HUD/Menu'

import PriorityQueue from '../../priority-queue.min.js';
import PlayerUnit from '../prefabs/Unit/PlayerUnit';
import EnemyUnit from '../prefabs/Unit/EnemyUnit';
import EnemyMenuItem from '../prefabs/HUD/EnemyMenuItem';
import ShowPlayerUnit from '../prefabs/HUD/ShowPlayerUnit';
import AutobattleMenuItem from '../prefabs/HUD/AutobattleMenuItem';

class GameScene extends JSONLevelScene {

    constructor(){
        super('GameScene');

        this.prefab_classes = {
            background: Prefab.prototype.constructor,
            enemy_unit: EnemyUnit.prototype.constructor,
            menu_item: MenuItem.prototype.constructor,
            physical_attack_menu_item: PhysicalAttackMenuItem.prototype.constructor,
            magical_attack_menu_item: MagicalAttackMenuItem.prototype.constructor,
            autobattle_menu_item: AutobattleMenuItem.prototype.constructor,
            enemy_menu_item: EnemyMenuItem.prototype.constructor,
            menu: Menu.prototype.constructor,
            player_unit: PlayerUnit.prototype.constructor,
            show_player_unit: ShowPlayerUnit.prototype.constructor
        }
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.AUTO = false;
    }
    preload(){
        this.enemy_stats =  this.load.json('bandit','assets/enemy_encounters/bandit.json');
    }

    create () {
        super.create();

        for(let player_unit_name in this.cache.game.party_data){
            let unit_data = this.cache.game.party_data[player_unit_name];
            this.prefabs[player_unit_name].stats = {};

            for(let stats_name in unit_data.stats){
                this.prefabs[player_unit_name].stats[stats_name] =
                unit_data.stats[stats_name];
            }
            
        }

        this.batte();
       
    }
    
    next_turn () {

        if (this.groups.enemy_units.countActive() === 0) {
            
            return this.batte();
        }
        
        if (this.groups.player_units.countActive() === 0) {
            this.game_over();
            return;
        }
        
        this.current_unit = this.units.dequeue();
        if (this.current_unit.active) {
            this.current_unit.act();
            this.current_unit.calculate_act_turn(this.current_unit.act_turn);
            this.units.queue(this.current_unit);
        } else {
            this.next_turn();
        }
    }
 
    create_new_enemy () {

        for (let enemy_unit_name in this.game.cache.json.get('bandit').enemy_data) {
            this.create_prefab(enemy_unit_name, this.game.cache.json.get('bandit').enemy_data[enemy_unit_name]);
            console.log(this.prefabs[enemy_unit_name].stats);

            if(this.prefabs[enemy_unit_name].stats != undefined){
                this.prefabs[enemy_unit_name].stats.health = 30;
            }
        }
    }

    game_over () {
        this.scene.start('BootScene', {scene: 'title'});
    }
    
    rewards () {
        //let received_experience = this.encounter.reward.experience;
        
        /*this.groups.player_units.children.each(function (player_unit) {
            player_unit.receive_experience(received_experience / this.groups.player_units.children.size);
            
            this.cache.game.party_data[player_unit.name].stats = player_unit.stats;
            this.cache.game.party_data[player_unit.name].experience = player_unit.experience;
            this.cache.game.party_data[player_unit.name].current_level = player_unit.current_level;
        }, this);*/
        
        

    }


    batte(){
        this.create_new_enemy();

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

        this.next_turn();
    }

}
 
export default GameScene;