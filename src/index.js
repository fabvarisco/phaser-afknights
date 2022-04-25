import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import LoadingScene from './scenes/LoadingScene';
import Inventory from './inventory/Inventory';


let titleScene = new TitleScene();
let bootScene = new BootScene();
let gameScene = new GameScene();
let loadingScene = new LoadingScene();


let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 630,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

} 
let game = new Phaser.Game(config);

game.inventory = new Inventory();
game.scene.add('TitleScene',titleScene);
game.scene.add('GameScene',gameScene);
game.scene.add('BootScene',bootScene);
game.scene.add('LoadingScene',loadingScene);
game.scene.start('BootScene', {scene:'title'});