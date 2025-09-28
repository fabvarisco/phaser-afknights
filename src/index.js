import {Scale, AUTO,Game} from "phaser";
import TitleScene from "./scenes/TitleScene";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";
import "./index.css";

const titleScene = new TitleScene();
const bootScene = new BootScene();
const gameScene = new GameScene();
const loadingScene = new LoadingScene();

let config = {
  type: AUTO,
  width: 320,
  height: 630,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },

  scale: {
    mode: Scale.RESIZE,
    autoCenter: Scale.CENTER_BOTH,
  },
};
const game = new Game(config);

game.scene.add("TitleScene", titleScene);
game.scene.add("GameScene", gameScene);
game.scene.add("BootScene", bootScene);
game.scene.add("LoadingScene", loadingScene);
game.scene.start("BootScene", { scene: "title" });
