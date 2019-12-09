import Prefab from '../prefabs/Prefab';
import JSONLevelScene from "./JSONLevelScene";
import Unit from '../prefabs/Unit/Unit';
import MenuItem from '../prefabs/HUD/MenuItem'
import PhysicalAttackMenuItem from '../prefabs/HUD/PhysicalAttackMenuItem'
import MagicalAttackMenuItem from '../prefabs/HUD/MagicalAttackMenuItem'
import Menu from '../prefabs/HUD/Menu'

import PriorityQueue from '../priority-queue.min.js';
import PlayerUnit from '../prefabs/Unit/PlayerUnit';
import EnemyUnit from '../prefabs/Unit/EnemyUnit';
import EnemyMenuItem from '../prefabs/HUD/EnemyMenuItem';
import InventoryMenuItem from '../prefabs/HUD/InventoryMenuItem';
import ShowPlayerUnit from '../prefabs/HUD/ShowPlayerUnit';
import AutobattleMenuItem from '../prefabs/HUD/AutobattleMenuItem';
import firebase from "firebase/app";
import database from "firebase/database";

class GameScene extends JSONLevelScene {

    constructor(){
        super('GameScene');

        this.prefab_classes = {
            background: Prefab.prototype.constructor,
            enemy_unit: EnemyUnit.prototype.constructor,
            menu_item: MenuItem.prototype.constructor,
            physical_attack_menu_item: PhysicalAttackMenuItem.prototype.constructor,
            magical_attack_menu_item: MagicalAttackMenuItem.prototype.constructor,
            inventory_menu_item: InventoryMenuItem.prototype.constructor,
            autobattle_menu_item: AutobattleMenuItem.prototype.constructor,
            enemy_menu_item: EnemyMenuItem.prototype.constructor,
            menu: Menu.prototype.constructor,
            player_unit: PlayerUnit.prototype.constructor,
            show_player_unit: ShowPlayerUnit.prototype.constructor
        }
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.AUTO = false;
        console.log("A");
    }
    preload(){
        //Carrega o json da tabela de xp 
        this.load.json('experience_table', 'src/assets/levels/experience_table.json');

        //Carrega o json dos inimigos
        this.enemy_stats =  this.load.json('bandit','src/assets/enemy_encounters/bandit.json');
    }

    create () {
        super.create();

        //Carrega inimigos
        this.cache.game.encounters_data =this.cache.json.get('bandit');


        //carrega tabela de xp
        this.experience_table = this.cache.json.get('experience_table');


        //Carrega a pt do jogador
        for(let player_unit_name in this.cache.game.party_data){
            let unit_data = this.cache.game.party_data[player_unit_name];
            this.prefabs[player_unit_name].stats = {};

            for(let stats_name in unit_data.stats){
                this.prefabs[player_unit_name].stats[stats_name] =
                unit_data.stats[stats_name];
            }
            this.prefabs[player_unit_name].experience = unit_data.experience;
            this.prefabs[player_unit_name].current_level = unit_data.current_level;
        }
        
        //Inicia combate
        this.batte();
       
    }
    
    next_turn () {

        if (this.groups.enemy_units.countActive() === 0) {
            
            return this.rewards();
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

        for (let enemy_unit_name in this.cache.game.encounters_data.enemy_data) {
            this.create_prefab(enemy_unit_name, this.cache.game.encounters_data.enemy_data[enemy_unit_name]);

            if(this.prefabs[enemy_unit_name].stats != undefined){
                this.prefabs[enemy_unit_name].stats.health = 30;
            }
        }
    }

    game_over () {
        this.scene.start('BootScene', {scene: 'title'});
    }
    
    rewards () {
        //XP
        let received_experience = this.cache.game.encounters_data.reward.experience;
        this.groups.player_units.children.each(function (player_unit) {
            player_unit.receive_experience(received_experience / this.groups.player_units.children.size);
            this.cache.game.party_data[player_unit.name].stats = player_unit.stats;
            this.cache.game.party_data[player_unit.name].experience = player_unit.experience;
            this.cache.game.party_data[player_unit.name].current_level = player_unit.current_level;
        
        }, this);

        //Items
        this.cache.game.encounters_data.reward.items.forEach(function(item_object){
            this.cache.game.inventory.collect_item(this,item_object);
        },this);
        


        //Recomeça a batalha

        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/party_data').set(this.cache.game.party_data).then(this.batte.bind(this));
    }


    batte(){
        //Cria novo inimigo
        this.create_new_enemy();

        //Logica do combate
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