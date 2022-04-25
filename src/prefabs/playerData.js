import Prefab from './Prefab';
import TextPrefab from './TextPrefab';
 
class PlayerData extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        this.unit_data = this.scene.cache.game.player_data.party_data;

        this.player_level = this.scene.cache.game.player_data.level;
        this.player_gold = parseInt(this.scene.cache.game.player_data.gold);
        this.player_name = this.scene.cache.game.player_data.user;
        this.player_score = this.scene.cache.game.player_data.score;


        /*this.name = this.scene.add.text(this.x + 100,this.y+ 110, this.player_name, {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        });*/



        /*this.score = this.scene.add.text(this.x + 10,this.y - (this.height-30), "CP: " + this.player_score, {
            font: "22px Arial",
            fill: "#ff0044",
            align: "center"
        });*/


        this.gold = this.scene.add.text(this.x + 100, this.y - (this.height-30) ,"Gold: " + this.player_gold, {
            font: "22px Arial",
            align: "center"
        });

        this.level = this.scene.add.text(this.x + 10,this.y - (this.height-30), "Level: " + this.player_level, {
            font: "22px Arial",
            fill: "#ff0044",
            align: "center"
        });


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
    
    updateText(recieved_score, recieved_gold, recieved_level){
        //this.player_score = recieved_score;
        this.player_gold = recieved_gold;
        this.player_level = recieved_level;

        //this.score.setText(this.player_score);

        this.gold.setText("Gold: " + this.player_gold);
        this.level.setText("Level: " +  this.player_level);
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