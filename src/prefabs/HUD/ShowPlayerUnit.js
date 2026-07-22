import Prefab from '../Prefab';

class ShowPlayerUnit extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.party_bar = {};
        this.party_cache_data = scene.cache.game.player_data.party_data;
        this.create_stats();
    }

    highlight_turn_unit(_party_key) {
        if (_party_key === "empty") return;
        if (this.party_bar[_party_key]) {
            this.party_bar[_party_key].party_bar.setTint(0x00FF00);
        }
    }

    highlight_target_unit(_party_key) {
        if (_party_key === "empty") return;
        if (this.party_bar[_party_key]) {
            this.party_bar[_party_key].party_bar.setTint(0xF21412);
        }
    }

    unfocused() {
        Object.values(this.party_bar).forEach(e => e.party_bar.setTint(0xFFFFFF));
    }

    defaultBarStyle() {
        return { font: "12px Arial", fill: "#000000", align: "center" };
    }

    create_stats() {
        let _index = 0;
        for (let player_unit_name in this.party_cache_data) {
            const unit_data = this.party_cache_data[player_unit_name];
            const bar_sprite = this.scene.add.sprite(this.x + 130, this.y + (80 * _index), "party_bar");
            const slot = { party_bar: bar_sprite };

            if (unit_data.prefab_name === "empty") {
                slot.empty_text = this.scene.add.text(
                    this.x + 65, this.y - 30 + (_index * 80), "Empty", this.defaultBarStyle()
                );
            } else {
                slot.face_sprite = this.scene.add.sprite(this.x + 35, this.y + (80 * _index), unit_data.face);
                slot.hp_text  = this.scene.add.text(this.x + 65, this.y - 30 + (_index * 80), "HP: " + unit_data.stats.health, this.defaultBarStyle());
                slot.mp_text  = this.scene.add.text(this.x + 65, this.y - 16 + (_index * 80), "MP: " + unit_data.stats.mana,   this.defaultBarStyle());
                slot.xp_text  = this.scene.add.text(this.x + 65, this.y - 2  + (_index * 80), "XP: " + unit_data.experience,   this.defaultBarStyle());
                slot.lvl_text = this.scene.add.text(this.x + 65, this.y + 12 + (_index * 80), "Lvl: " + unit_data.current_level, this.defaultBarStyle());
            }

            this.party_bar[player_unit_name] = slot;
            _index++;
        }
    }

    rebuild() {
        for (const key in this.party_bar) {
            const slot = this.party_bar[key];
            for (const prop in slot) {
                const obj = slot[prop];
                if (obj && typeof obj.destroy === 'function') obj.destroy();
            }
        }
        this.party_bar = {};
        this.party_cache_data = this.scene.cache.game.player_data.party_data;
        this.create_stats();
    }

    update_stats() {
        for (let player_unit_name in this.party_cache_data) {
            const unit_data = this.party_cache_data[player_unit_name];
            if (unit_data.prefab_name === "empty") continue;
            const slot = this.party_bar[player_unit_name];
            if (!slot) continue;
            slot.hp_text.setText("HP: " + unit_data.stats.health);
            slot.mp_text.setText("MP: " + unit_data.stats.mana);
            slot.xp_text.setText("XP: " + unit_data.experience);
            slot.lvl_text.setText("Lvl: " + unit_data.current_level);
        }
    }
}

export default ShowPlayerUnit;
