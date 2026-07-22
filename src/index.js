import { AUTO, Game } from "phaser";
import TitleScene from "./scenes/TitleScene";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";
import HeroRosterScene from "./scenes/HeroRosterScene";
import "./index.css";

const config = {
  type: AUTO,
  width: 320,
  height: 630,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 } },
  },
};
const game = new Game(config);

game.scene.add("TitleScene",      new TitleScene());
game.scene.add("GameScene",       new GameScene());
game.scene.add("BootScene",       new BootScene());
game.scene.add("LoadingScene",    new LoadingScene());
game.scene.add("HeroRosterScene", new HeroRosterScene());
game.scene.start("BootScene", { scene: "title" });
