import Inventory from "../inventory/Inventory";

class PlayerData {
  constructor(player_json) {
    this.party_data = player_json.party_data;
    this.owned_heroes = (player_json.owned_heroes || []).map(h => ({
      equipment: [null, null, null, null, null, null],
      ...h,
      stats_base: h.stats_base ? { ...h.stats_base } : { ...h.stats },
    }));
    this.gold = parseInt(player_json.gold) || 0;
    this.level = player_json.level || 1;
    this.score = player_json.score || 0;
    this.player_name = player_json.user || "";
    this.inventory = new Inventory();
  }

  getHeroData(hero_id) {
    return this.owned_heroes.find(h => h.hero_id === hero_id) || null;
  }

  playerCreate(scene) {
    this.gold_text = scene.add.text(200, 10, "Gold: " + this.gold, {
      font: "22px Arial",
      align: "center",
    });
    this.level_text = scene.add.text(10, 10, "Level: " + this.level, {
      font: "22px Arial",
      fill: "#ff0044",
      align: "center",
    });
  }

  playerCreateInventory(scene, items_menu) {
    this.inventory.create_menu(scene, items_menu);
  }

  updateText(recieved_score, recieved_gold, recieved_level) {
    this.gold = recieved_gold;
    this.level = recieved_level;
    if (this.gold_text) this.gold_text.setText("Gold: " + this.gold);
    if (this.level_text) this.level_text.setText("Level: " + this.level);
  }
}

export default PlayerData;
