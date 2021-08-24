import TitleScene from './scenes/TitleScene';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import LoadingScene from './scenes/LoadingScene';



let titleScene = new TitleScene();
let bootScene = new BootScene();
let gameScene = new GameScene();
let loadingScene = new LoadingScene();


let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 630,
    scene: [TitleScene,BootScene,GameScene,LoadingScene],
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
game.scene.start('BootScene', {scene:'title'});