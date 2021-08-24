import Prefab from '../prefabs/Prefab';
import TextPrefab from '../prefabs/TextPrefab';
import JSONLevelScene from "./JSONLevelScene";

class TitleScene extends JSONLevelScene {

    constructor(){
        super('TitleScene');

        this.prefab_classes ={
            background: Prefab.prototype.constructor
        }

        
    }
    preload () {
        this.load.json('default_data', 'src/assets/default_data.json');
    }
    
    create () {
        super.create();
        
        this.default_data = this.cache.json.get('default_data');

        this.input.on('pointerdown', function (pointer) {
           this.login();
        }, this);
    }
    
    start_game() {
        this.scene.start('BootScene', {scene: 'game'});
    }
    
    login () {
        retrieve_data();
    }
    
    on_login (result) {
        
    }
    
    retrieve_data (snapshot) {
        let user_data = snapshot.val();
        if (!user_data) {
            this.cache.game.player_data = this.default_data.player_data;
            
        } else {
            this.cache.game.player_data = user_data.player_data || this.default_data.player_data;
            /*let items = user_data.items || this.default_data.items;
            for (let item_key in items) {
                this.cache.game.inventory.collect_item(this, items[item_key], item_key);
            }*/
            this.start_game();
        }
    }
    
    handle_error(error) {
        console.log(error);
    }
}

export default TitleScene;