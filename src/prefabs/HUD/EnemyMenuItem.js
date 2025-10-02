import MenuItem from "../HUD/MenuItem";

class EnemyMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
    this.enemy = this.scene.prefabs[properties.enemy_name];
    console.log("this.enemy")
    console.log(this.enemy)
  }

  select() {
    if(this.enemy.stats.health <= 0) return;
    this.scene.prefabs.actions_menu.enableBack(false);
    this.scene.prefabs.enemy_units_menu.enable(false);
    this.scene.current_attack.hit(this.enemy);
  }

  hide(){
    if(this.enemy.stats.health <= 0){
      this.scene.prefabs.enemy_units_menu.enable(false);
    }
  }
  show(){
    if(this.enemy.stats.health > 0){
      this.scene.prefabs.enemy_units_menu.enable(true);
    }
  }

}

export default EnemyMenuItem;
