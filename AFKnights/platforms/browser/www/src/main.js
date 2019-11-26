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
    width:800,
    height: 600

} 

let game = new Phaser.Game(config);
game.scene.add('TitleScene',titleScene);
game.scene.add('BootScene',bootScene);
game.scene.add('LoadingScene',loadingScene);
game.scene.add('GameScene',gameScene);
game.scene.start('BootScene', {scene:'title'});