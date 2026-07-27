import MenuItem from "./MenuItem";

class PartyMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
  }

  select() {
    const previous_auto = this.scene.AUTO;
    this.scene.AUTO = false;
    this.scene.prefabs.actions_menu.enable(false);
    this.scene.scene.launch("HeroRosterScene", {
      player_data: this.scene.player_data,
      previous_auto,
    });
  }
}

export default PartyMenuItem;
