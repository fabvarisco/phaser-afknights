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

    update(){

        if(this.input.activePointer.isDown){
            this.start_game();
        }
    }
    start_game(){
        this.scene.start('BootScene', {scene:'game'});
    }
}

export default TitleScene;