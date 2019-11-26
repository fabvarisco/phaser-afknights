import Prefab from '../prefabs/Prefab';
import JSONLevelScene from "./JSONLevelScene";
import Unit from '../prefabs/Unit';
class GameScene extends JSONLevelScene {

    constructor(){
        super('GameScene');

        this.prefab_classes ={
            background: Prefab.prototype.constructor,
            player_unit: Unit.prototype.constructor,
            enemy_unit: Unit.prototype.constructor
        }

    }

    update(){


    }

}

export default GameScene;