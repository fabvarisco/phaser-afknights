import Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";
import Inventory from "./inventory/Inventory";

const titleScene = new TitleScene();
const bootScene = new BootScene();
const gameScene = new GameScene();
const loadingScene = new LoadingScene();

let config = {
  type: Phaser.AUTO,
  width: 320,
  height: 630,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
const game = new Phaser.Game(config);

game.scene.add("TitleScene", titleScene);
game.scene.add("GameScene", gameScene);
game.scene.add("BootScene", bootScene);
game.scene.add("LoadingScene", loadingScene);
game.scene.start("BootScene", { scene: "title" });
