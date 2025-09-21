import MenuItem from "../HUD/MenuItem";

class EnemyMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
    this.enemy = this.scene.prefabs[properties.enemy_name];
    console.log(this.enemy)
  }

  select() {
    console.log("SELECT")
    console.log(this.enemy)
    this.scene.prefabs.actions_menu.enableBack(false);
    this.scene.prefabs.enemy_units_menu.enable(false);
    this.scene.current_attack.hit(this.enemy);
  }
}

export default EnemyMenuItem;
