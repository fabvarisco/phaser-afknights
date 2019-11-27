import firebase from "firebase/app";
import TitleScene from '../src/scenes/TitleScene'
import BootScene from '../src/scenes/BootScene'
import GameScene from '../src/scenes/GameScene'
import LoadingScene from '../src/scenes/LoadingScene'

let titleScene = new TitleScene();
let bootScene = new BootScene();
let gameScene = new GameScene();
let loadingScene = new LoadingScene();


let config = {
    type: Phaser.AUTO,
    width: 380,
    height: 740,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    }

} 
var firebaseConfig = {
    apiKey: "AIzaSyDCEZUmGZolpVypl1qYw7ck_KMI6-VFtzQ",
    authDomain: "afkinghts.firebaseapp.com",
    databaseURL: "https://afkinghts.firebaseio.com",
    projectId: "afkinghts",
    storageBucket: "afkinghts.appspot.com",
    messagingSenderId: "60348582192",
    appId: "1:60348582192:web:5fe50eeb81377dc62360f5",
    measurementId: "G-BDQ8PKPBLX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 // firebase.analytics(); 

let game = new Phaser.Game(config);
game.scene.add('TitleScene',titleScene);
game.scene.add('GameScene',gameScene);
game.scene.add('BootScene',bootScene);
game.scene.add('LoadingScene',loadingScene);
game.scene.start('BootScene', {scene:'title'});