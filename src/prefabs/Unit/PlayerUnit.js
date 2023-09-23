/* eslint-disable camelcase */
import Unit from "./Unit";
import PhysicalAttack from "../Attacks/PhysicalAttack";

class PlayerUnit extends Unit {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);

    this.face_texture = properties.face_texture;

    this.target_units = properties.target_units;
    this.attack = new PhysicalAttack(
      this.scene,
      this.name + "_attack",
      { x: 0, y: 0 },
      { group: "attacks", owner: this }
    );
  }

  act() {
    // this.scene.prefabs.show_player_unit.show(true);

    this.scene.prefabs.show_player_unit.update_stats();

    if (this.scene.AUTO) {
      const target = this.choose_target();
      this.attack.hit(target);
    } else {
      this.scene.prefabs.actions_menu.enable(true);
    }
  }

  choose_target() {
    let target;
    const target_index = this.scene.rnd.between(
      0,
      this.scene.groups[this.target_units].countActive() - 1
    );
    let alive_enemy_unit_index = 0;
    this.scene.groups[this.target_units].children.each(function (unit) {
      if (unit.active) {
        if (alive_enemy_unit_index === target_index) {
          target = unit;
        }
        alive_enemy_unit_index += 1;
      }
    }, this);
    return target;
  }

  receive_experience(experience) {
    this.experience += experience;
    const next_level_data = this.scene.experience_table[this.current_level];
    console.log(next_level_data.required_exp)
    if (this.experience >= next_level_data.required_exp) {
      console.log("aqui")
      this.current_level += 1;
      this.experience = 0;
      for (const stat in next_level_data.stats_increase) {
        // eslint-disable-next-line no-prototype-builtins
        if (next_level_data.stats_increase.hasOwnProperty(stat)) {
          this.stats[stat] += next_level_data.stats_increase[stat];
        }
      }
    }
  }
}

export default PlayerUnit;
