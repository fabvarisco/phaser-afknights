import Prefab from "./Prefab";
import Inventory from "../inventory/Inventory";

class PlayerData {
  constructor(player_json) {


    this.party_data = player_json.party_data;
    this.player_level = player_json.level;
    this.player_gold = parseInt(player_json.gold);
    this.player_name = player_json.user;
    this.player_score = player_json.score;
    this.inventory = new Inventory();


  }
  playerCreate(scene){

    this.gold = scene.add.text(
        this.x + 100,
        this.y - (this.height - 30),
        "Gold: " + this.player_gold,
        {
          font: "22px Arial",
          align: "center",
        }
    );

    this.level = scene.add.text(
        this.x + 10,
        this.y - (this.height - 30),
        "Level: " + this.player_level,
        {
          font: "22px Arial",
          fill: "#ff0044",
          align: "center",
        }
    );

  }

  playerCreateInventory(scene, items_menu){
      this.inventory.create_menu(scene,items_menu);
  }


  updateText(recieved_score, recieved_gold, recieved_level) {
    //this.player_score = recieved_score;
    this.player_gold = recieved_gold;
    this.player_level = recieved_level;

    //this.score.setText(this.player_score);

    this.gold.setText("Gold: " + this.player_gold);
    this.level.setText("Level: " + this.player_level);
    /*this.gold = this.scene.add.text(this.x + 100,this.y+ 110, this.player_gold, {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        });

        this.level = this.scene.add.text(this.x + 100,this.y+ 110, this.player_level, {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        });*/
  }
}

export default PlayerData;
