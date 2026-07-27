import MenuItem from "./MenuItem";

class EquipmentMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);
  }

  select() {
    this.scene.prefabs.actions_menu.enable(false);
    this.scene.scene.launch("EquipmentScene", {
      player_data: this.scene.player_data,
    });
  }
}

export default EquipmentMenuItem;
