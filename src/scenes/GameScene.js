import { Math } from "phaser";
import Prefab from "../prefabs/Prefab";
import JSONLevelScene from "./JSONLevelScene";
import MenuItem from "../prefabs/HUD/MenuItem";
import PhysicalAttackMenuItem from "../prefabs/HUD/PhysicalAttackMenuItem";
import MagicalAttackMenuItem from "../prefabs/HUD/MagicalAttackMenuItem";
import Menu from "../prefabs/HUD/Menu";
import PlayerUnit from "../prefabs/Unit/PlayerUnit";
import EnemyUnit from "../prefabs/Unit/EnemyUnit";
import EnemyMenuItem from "../prefabs/HUD/EnemyMenuItem";
import InventoryMenuItem from "../prefabs/HUD/InventoryMenuItem";
import ShowPlayerUnit from "../prefabs/HUD/ShowPlayerUnit";
import AutobattleMenuItem from "../prefabs/HUD/AutobattleMenuItem";
import PartyMenuItem from "../prefabs/HUD/PartyMenuItem";
import ItemMenuItem from "../prefabs/HUD/ItemMenuItem.js";
import PlayerData from "../prefabs/playerData";
import BackMenuItem from "../prefabs/HUD/backMenuItem";
import PriorityQueue from "js-priority-queue";

class GameScene extends JSONLevelScene {
  constructor() {
    super("GameScene");
    this.prefab_classes = {
      background: Prefab.prototype.constructor,
      enemy_unit: EnemyUnit.prototype.constructor,
      menu_item: MenuItem.prototype.constructor,
      physical_attack_menu_item: PhysicalAttackMenuItem.prototype.constructor,
      magical_attack_menu_item: MagicalAttackMenuItem.prototype.constructor,
      inventory_menu_item: InventoryMenuItem.prototype.constructor,
      autobattle_menu_item: AutobattleMenuItem.prototype.constructor,
      party_menu_item: PartyMenuItem.prototype.constructor,
      enemy_menu_item: EnemyMenuItem.prototype.constructor,
      menu: Menu.prototype.constructor,
      player_unit: PlayerUnit.prototype.constructor,
      show_player_unit: ShowPlayerUnit.prototype.constructor,
      item_menu_item: ItemMenuItem.prototype.constructor,
      back_menu_item: BackMenuItem.prototype.constructor,
    };
    this.rnd = new Math.RandomDataGenerator();
    this.AUTO = false;
    this.enemy_data_array_stats = [];
    this.encounter_index = 0;
  }

  preload() {
    this.player_data = this.cache.game.player_data;
    this.load.json("experience_table", "assets/levels/experience_table.json");
    this.load.json("heroes_catalog", "assets/heroes/catalog.json");
    this.load.json("archer", "assets/enemy_encounters/archer.json");
    this.load.json("bandit", "assets/enemy_encounters/bandit.json");
  }

  create() {
    super.create();
    this.load_enemy_data();

    // Desativar todos os heróis; só os da party ficam visíveis
    this.groups.player_units.children.each(unit => {
      unit.setActive(false).setVisible(false);
    });

    this.player_data.playerCreate(this, this.prefabs.items_menu);

    this.experience_table = this.cache.json.get("experience_table");

    this._apply_party_to_sprites();

    this.player_data.inventory.collect_item(this, {
      type: "potion",
      properties: { group: "items", item_texture: "potion_image", health_power: 50 },
    });

    this.battle();
  }

  _apply_party_to_sprites() {
    const positions = {
      party1: { x: 120, y: 150 },
      party2: { x: 76,  y: 90  },
      party3: { x: 50,  y: 200 },
    };

    for (let slot in this.player_data.party_data) {
      const unit_data = this.player_data.party_data[slot];
      const name = unit_data.prefab_name;
      if (name === "empty") continue;

      const sprite = this.prefabs[name];
      sprite.setActive(true).setVisible(true);
      sprite.stats = { ...unit_data.stats };
      sprite.experience = unit_data.experience;
      sprite.current_level = unit_data.current_level;
      sprite.party_key = slot;
      sprite.hero_id = unit_data.hero_id;
      sprite.x = positions[slot].x;
      sprite.y = positions[slot].y;
    }
  }

  nextTurn() {
    this.prefabs.show_player_unit.unfocused();

    if (this.groups.enemy_units.countActive() === 0) {
      return this.rewards();
    }
    if (this.groups.player_units.countActive() === 0) {
      this.gameOver();
      return;
    }
    this.current_unit = this.units.dequeue();

    if (this.current_unit.active) {
      this.current_unit.act();
      this.current_unit.calculate_act_turn(this.current_unit.act_turn);
      if (this.current_unit.type === "player_unit") {
        this.prefabs.show_player_unit.highlight_turn_unit(this.current_unit.party_key);
      }
      this.units.queue(this.current_unit);
    } else {
      this.nextTurn();
    }
  }

  createNewEnemy() {
    const encounter = this.cache.game.encounters_data[0];
    for (let enemy_unit_name in encounter.enemy_data) {
      const enemy_data = encounter.enemy_data[enemy_unit_name];
      this.create_prefab(enemy_unit_name, enemy_data);
      if (this.prefabs[enemy_unit_name].type === "enemy_unit") {
        this.prefabs[enemy_unit_name].reset_unit_health();
      }
    }
  }

  gameOver() {
    this.scene.start("BootScene", { scene: "title" });
  }

  rewards() {
    const encounter = this.cache.game.encounters_data[0];
    const received_experience = encounter.reward?.experience || 0;
    const recieved_gold = encounter.reward.gold;
    const recieved_score = encounter.reward.score;

    this.groups.player_units.children.each(function (player_unit) {
      if (!player_unit.active) return;
      player_unit.receive_experience(
        received_experience / this.groups.player_units.countActive()
      );
      const slot = player_unit.party_key;
      this.player_data.party_data[slot].stats = player_unit.stats;
      this.player_data.party_data[slot].experience = player_unit.experience;
      this.player_data.party_data[slot].current_level = player_unit.current_level;

      // Sync de volta para owned_heroes
      const hero_entry = this.player_data.getHeroData(player_unit.hero_id);
      if (hero_entry) {
        hero_entry.stats = player_unit.stats;
        hero_entry.experience = player_unit.experience;
        hero_entry.current_level = player_unit.current_level;
      }
    }, this);

    this.player_data.gold += recieved_gold;
    this.player_data.score += recieved_score;
    this.player_data.level++;

    this.groups.player_hud.children.each(function (hud) {
      hud.updateText(recieved_score, recieved_gold, this.player_data.level);
    }, this);

    encounter.reward.items.forEach(function (item_object) {
      this.player_data.inventory.collect_item(this, item_object);
    }, this);

    this.prefabs.show_player_unit.update_stats();
    this.encounter_index++;
    this.battle();
  }

  battle() {
    this.player_data.playerCreateInventory(this, this.prefabs.items_menu);
    this.createNewEnemy();
    this._rebuild_turn_queue();
  }

  restart_party() {
    // Esconder todos os heróis e reconfigurar a party
    this.groups.player_units.children.each(unit => {
      unit.setActive(false).setVisible(false);
    });
    this._apply_party_to_sprites();

    // Reset saúde dos inimigos ativos para reinício justo
    this.groups.enemy_units.children.each(unit => {
      if (unit.active) unit.reset_unit_health();
    });

    this.prefabs.show_player_unit.rebuild();
    this._rebuild_turn_queue();
  }

  _rebuild_turn_queue() {
    this.units = new PriorityQueue({
      comparator: function (unit_a, unit_b) {
        return unit_a.act_turn - unit_b.act_turn;
      },
    });

    this.groups.player_units.children.each(function (unit) {
      if (!unit.active) return;
      unit.calculate_act_turn(0);
      this.units.queue(unit);
    }, this);

    this.groups.enemy_units.children.each(function (unit) {
      if (!unit.active) return;
      unit.calculate_act_turn(this.groups.player_units.countActive());
      this.units.queue(unit);
    }, this);

    this.nextTurn();
  }

  load_enemy_data() {
    if (!this.cache.game.encounters_data) {
      this.cache.game.encounters_data = [
        this.cache.json.get("archer"),
        this.cache.json.get("bandit"),
      ];
    } else {
      this.cache.game.encounters_data.shift();
    }
  }
}

export default GameScene;
