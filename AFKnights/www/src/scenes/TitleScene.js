import Prefab from '../prefabs/Prefab';
import TextPrefab from '../prefabs/TextPrefab';
import JSONLevelScene from "./JSONLevelScene";
import firebase from "firebase/app";
import auth from "firebase/auth";

class TitleScene extends JSONLevelScene {

    constructor(){
        super('TitleScene');

        this.prefab_classes ={
            background: Prefab.prototype.constructor
        }

        
    }
    preload(){
        this.load.json('default_data','assets/default_data.json');

    }

    create(){
        super.create();

        this.cache.game.party_data = this.cache.json.get('default_data');
    }
    update(){

        if(this.input.activePointer.isDown){
            this.login();
        }
    }
    start_game(){
        this.scene.start('BootScene', {scene:'game'});
    }
    login (){
        if(!firebase.auth().currentUser)
        {
            let provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/userinfo.email');

            firebase.auth().signInWithPopup(provider).then(this.start_game.bind(this)).catch(this.handle_error.bind(this));
        }else{
            this.start_game();
        }
    }
    handle_error(error)
    {
        console.log(error);
    }
}

export default TitleScene;