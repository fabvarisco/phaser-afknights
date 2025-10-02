import {Math} from "phaser";
import Prefab from '../prefabs/Prefab';
import JSONLevelScene from "./JSONLevelScene";
import MenuItem from '../prefabs/HUD/MenuItem'
import PhysicalAttackMenuItem from '../prefabs/HUD/PhysicalAttackMenuItem'
import MagicalAttackMenuItem from '../prefabs/HUD/MagicalAttackMenuItem'
import Menu from '../prefabs/HUD/Menu'
import PlayerUnit from '../prefabs/Unit/PlayerUnit';
import EnemyUnit from '../prefabs/Unit/EnemyUnit';
import EnemyMenuItem from '../prefabs/HUD/EnemyMenuItem';
import InventoryMenuItem from '../prefabs/HUD/InventoryMenuItem';
import ShowPlayerUnit from '../prefabs/HUD/ShowPlayerUnit';
import AutobattleMenuItem from '../prefabs/HUD/AutobattleMenuItem';

import ItemMenuItem from '../prefabs/HUD/ItemMenuItem.js';
import PlayerData from '../prefabs/playerData';

import BackMenuItem from '../prefabs/HUD/backMenuItem';

import PriorityQueue from 'js-priority-queue';

class GameScene extends JSONLevelScene {
    constructor() {
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
            show_player_unit: ShowPlayerUnit.prototype.constructor,
            item_menu_item: ItemMenuItem.prototype.constructor,
            back_menu_item: BackMenuItem.prototype.constructor
        }
        this.rnd = new Math.RandomDataGenerator();
        this.AUTO = false;
        this.enemy_data_array_stats = [];
    }

    preload() {
        this.player_data = this.cache.game.player_data;

        //Carrega o json da tabela de xp 
        this.load.json('experience_table', 'assets/levels/experience_table.json');
        this.load.json('archer', 'assets/enemy_encounters/archer.json');
        this.load.json('bandit', 'assets/enemy_encounters/bandit.json');
        //Carrega o json dos inimigos
        //this.enemy_stats = this.load.json('bandit', 'assets/enemy_encounters/bandit.json');
        //this.enemy_stats = this.load.json('bandit', 'assets/enemy_encounters/bandit.json');


        //Carrega o json dos inimigos
        //this.enemy_data_array_stats.push(this.load.json('bandit', 'assets/enemy_encounters/bandit.json'));
        //this.enemy_data_array_stats.push(this.load.json('archer', 'assets/enemy_encounters/archer.json'));
    }

    create() {
        super.create();
        this.player_data.playerCreate(this, this.prefabs.items_menu)

        this.experience_table = this.cache.json.get('experience_table');
        for (let player_unit in this.player_data.party_data) {
            const unit_data = this.player_data.party_data[player_unit];
            const name = unit_data.prefab_name;
            if(name === "empty") continue;
            
            this.prefabs[name].stats = unit_data.stats;     
            this.prefabs[name].experience = unit_data.experience;
            this.prefabs[name].current_level = unit_data.current_level;
            this.prefabs[name].party_key = player_unit;

            if (player_unit === "party1") {
                this.prefabs[name].x = 120;
                this.prefabs[name].y = 150;
            } else if (player_unit === "party2") {
                this.prefabs[name].x = 76;
                this.prefabs[name].y = 90;
            } else if (player_unit === "party3") {
                this.prefabs[name].x = 50;
                this.prefabs[name].y = 200;
            }
        }
        this.player_data.inventory.collect_item(this, {
            "type": "potion",
            "properties": {"group": "items", "item_texture": "potion_image", "health_power": 50}
        });


        this.battle();
    }

    nextTurn() {
        
        if (this.groups.enemy_units.countActive() === 0) {
            return this.rewards();
        }
        if (this.groups.player_units.countActive() === 0) {
            this.gameOver();
            return;
        }
        this.current_unit = this.units.dequeue();
        
        console.log(this.current_unit.name + " is playing");
        console.log(this.current_unit);
        console.log("______________________________");
        if (this.current_unit.active) {
            this.current_unit.act();
            this.current_unit.calculate_act_turn(this.current_unit.act_turn);
            if(this.current_unit.type === "player_unit"){
                this.prefabs.show_player_unit.highlight_turn_unit(this.current_unit.party_key);
            }
            this.units.queue(this.current_unit);
        } else {
            this.nextTurn();
        }
    }

    createNewEnemy() {
        const encounter = this.cache.game.encounters_data[0]
        console.log(encounter)
        for (let enemy_unit_name in encounter.enemy_data) {
            this.create_prefab(enemy_unit_name, encounter.enemy_data[enemy_unit_name]);
            console.log(enemy_unit_name)
            // if (this.prefabs[enemy_unit_name] !== null){
            //     this.create_prefab(enemy_unit_name, encounter.enemy_data[enemy_unit_name]);
            // }else{ 
            //     this.prefabs[enemy_unit_name] = encounter.enemy_data[enemy_unit_name]
            // }
        }
    }

    gameOver() {
        this.scene.start('BootScene', {scene: 'title'});
    }

    rewards() {
        //XP
        const encounter = this.cache.game.encounters_data[0]
        let received_experience = encounter.reward?.experience;
        let recieved_gold = encounter.reward.gold;
        let recieved_score = encounter.reward.score;
        let received_player_experience = this.player_data.level;
        received_player_experience++;

        this.groups.player_units.children.each(function (player_unit) {
            player_unit.receive_experience(received_experience / this.groups.player_units.children.size);
            const _key = player_unit.party_key;
            this.player_data.party_data[_key].stats = player_unit.stats;
            this.player_data.party_data[_key].experience = player_unit.experience;
            this.player_data.party_data[_key].current_level = player_unit.current_level;
        }, this);

        this.groups.player_hud.children.each(function (hud) {
            hud.updateText(recieved_score, recieved_gold, received_player_experience);
        }, this);

        //gold
        this.player_data.gold += recieved_gold;

        //score
        this.player_data.score += recieved_score;

        //player Experience
        this.player_data.level = received_player_experience;


        //Items
        encounter.reward.items.forEach(function (item_object) {
            this.cache.game.player_data.inventory.collect_item(this, item_object);
        }, this);

        this.prefabs.show_player_unit.update_stats();

        //firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/player_data').set(this.player_data).then(this.battle.bind(this));
        this.battle();
    }

    battle() {
        this.player_data.playerCreateInventory(this, this.prefabs.items_menu);
        this.GenerateEnemy();
        this.createNewEnemy();

        //Logica do combate
        this.units = new PriorityQueue({
            comparator: function (unit_a, unit_b) {
                return unit_a.act_turn - unit_b.act_turn;
            }
        });

        this.groups.player_units.children.each(function (unit) {
            unit.calculate_act_turn(0);
            this.units.queue(unit);
        }, this);

        this.groups.enemy_units.children.each(function (unit) {
            unit.calculate_act_turn(this.groups.player_units.children.size);
            this.units.queue(unit);
        }, this);


        this.nextTurn();
    }

    GenerateEnemy() {
        if (!this.cache.game.encounters_data){
            let enemy_data_array = [];
    
            enemy_data_array.push(this.cache.json.get('archer'));
            enemy_data_array.push(this.cache.json.get('bandit'));
           
            this.cache.game.encounters_data = enemy_data_array;
        }else {
            console.log("this.cache.game.encounters_data", this.cache.game.encounters_data)
            this.cache.game.encounters_data.shift()
        }
    }
}

export default GameScene;