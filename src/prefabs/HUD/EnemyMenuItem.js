import MenuItem from "../HUD/MenuItem";

class EnemyMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
    this.enemy = this.scene.prefabs[properties.enemy_name];
    console.log("----------------------------------")
    console.log(properties)
    console.log(this.scene.prefabs)
    console.log(name)
    console.log(this.enemy)
    console.log("----------------------------------")

    this.active = true;
  }


  setEnemyData(_enemy) {
    this.enemy = _enemy;
  }

  select() {
    console.log(this.enemy)
    if(this.enemy.stats.health <= 0) return;
    this.scene.prefabs.actions_menu.enableBack(false);
    this.scene.prefabs.enemy_units_menu.enable(false);
    this.scene.current_attack.hit(this.enemy);
  }

  hide(){
    if(this.enemy.stats.health <= 0){
      this.setInteractive(false);
      this.setVisible(false);
      this.active = false;
    }
  }
  show(){
    if(this.enemy.stats.health > 0){
      this.setInteractive(true);
      this.setVisible(true);
      this.active = true;
    }
  }

}

export default EnemyMenuItem;
