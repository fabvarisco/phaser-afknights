import MenuItem from "./MenuItem";

class AutobattleMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
  }

  select() {
    this.scene.AUTO = !this.scene.AUTO;

    this.scene.prefabs.actions_menu.autoBattleEnable();
    this.scene.prefabs.enemy_units_menu.enable(false);

    this.scene.current_unit.act();
  }
}

export default AutobattleMenuItem;
