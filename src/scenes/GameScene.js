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
import ItemMenuItem from '../prefabs/HUD/ItemMenuItem.js';
import firebase from "firebase/app";
import database from "firebase/database";
import PlayerData from '../prefabs/playerData';
import BackMenuItem from '../prefabs/HUD/backMenuItem';

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
            player: PlayerData.prototype.constructor,
            back_menu_item: BackMenuItem.prototype.constructor

        }
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.AUTO = false;
        this.enemy_data_array_stats = []; 

    }
    preload() {
        //Carrega o json da tabela de xp 
        this.load.json('experience_table', 'src/assets/levels/experience_table.json');

        //Carrega o json dos inimigos
        //this.enemy_stats = this.load.json('bandit', 'src/assets/enemy_encounters/bandit.json');
        //this.enemy_stats = this.load.json('bandit', 'src/assets/enemy_encounters/bandit.json');



        //Carrega o json dos inimigos
        //this.enemy_data_array_stats.push(this.load.json('bandit', 'src/assets/enemy_encounters/bandit.json'));
        //this.enemy_data_array_stats.push(this.load.json('archer', 'src/assets/enemy_encounters/archer.json'));


        this.enemy_stats =  this.load.json('bandit','src/assets/enemy_encounters/bandit.json');


        console.log(this.groups);

    }

    create() {
        super.create();

        //Carrega inimigos
        this.cache.game.encounters_data =this.cache.json.get('bandit');

        //this.GenerateEnemy();


        //carrega tabela de xp
        this.experience_table = this.cache.json.get('experience_table');


        //Carrega a pt do jogador
        for (let player_unit_name in this.cache.game.player_data.party_data) {
            let unit_data = this.cache.game.player_data.party_data[player_unit_name];
            this.prefabs[player_unit_name].stats = {};

            for (let stats_name in unit_data.stats) {
                this.prefabs[player_unit_name].stats[stats_name] =
                    unit_data.stats[stats_name];
            }
            this.prefabs[player_unit_name].experience = unit_data.experience;
            this.prefabs[player_unit_name].current_level = unit_data.current_level;
        }
        this.cache.game.inventory.collect_item(this, { "type": "potion", "properties": { "group": "items", "item_texture": "potion_image", "health_power": 50 } });

        //Inicia combate
        this.battle();

    }

    next_turn() {

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

    create_new_enemy() {

        for (let enemy_unit_name in this.cache.game.encounters_data.enemy_data) {
            this.create_prefab(enemy_unit_name, this.cache.game.encounters_data.enemy_data[enemy_unit_name]);

            if (this.prefabs[enemy_unit_name].stats != undefined) {
                this.prefabs[enemy_unit_name].stats.health = 30;
            }
        }
    }

    game_over() {
        this.scene.start('BootScene', { scene: 'title' });
    }

    rewards() {
        //XP
        let received_experience = this.cache.game.encounters_data.reward.experience;
        let recieved_gold = this.cache.game.encounters_data.reward.gold;
        let recieved_score = this.cache.game.encounters_data.reward.score;

        this.groups.player_units.children.each(function (player_unit) {
            player_unit.receive_experience(received_experience / this.groups.player_units.children.size);
            this.cache.game.player_data.party_data[player_unit.name].stats = player_unit.stats;
            this.cache.game.player_data.party_data[player_unit.name].experience = player_unit.experience;
            this.cache.game.player_data.party_data[player_unit.name].current_level = player_unit.current_level;
        }, this);


        this.groups.player_hud.children.each(function (hud) {
            hud.updateText(recieved_score, recieved_gold);
        }, this);

        //gold
        this.cache.game.player_data.gold += recieved_gold;

        //score
        this.cache.game.player_data.score += recieved_score;

        //Items
        this.cache.game.encounters_data.reward.items.forEach(function (item_object) {
            console.log(this.cache.game.encounters_data.reward.items);
            this.cache.game.inventory.collect_item(this, item_object);
        }, this);

        //Recomeça a batalha
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/player_data').set(this.cache.game.player_data).then(this.battle.bind(this));
    }


    battle() {
        this.cache.game.inventory.create_menu(this, this.prefabs.items_menu);

        //Cria novo inimigo

        this.create_new_enemy();


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
            console.log(this.groups.player_units.children.size)
            unit.calculate_act_turn(this.groups.player_units.children.size);
            this.units.queue(unit);
        }, this);



        this.next_turn();
    }

    GenerateEnemy() {
        let enemy_data_array = []; 



        enemy_data_array.push(this.cache.json.get('bandit'));
        enemy_data_array.push(this.cache.json.get('archer'));
        

        this.enemy_stats = this.enemy_data_array_stats[0];

        this.cache.game.encounters_data = enemy_data_array;
        debugger
    }
}

export default GameScene;