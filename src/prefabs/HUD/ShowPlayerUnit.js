import Prefab from '../Prefab';
class ShowPlayerUnit extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.party_bar = "party_bar";
        this.face_texture = [];
        this.face_sprite = [];
        this.party_bar_sprite = [];
        this.party_cache_data = scene.cache.game.player_data.party_data;
        this.update_stats();
    }

    highlight_turn_unit(_party_key) {
        if(_party_key === "empty") return;
        this.party_bar_sprite[_party_key].setTint(0x00FF00);
    }

    highlight_target_unit(_party_key) {
        if(_party_key === "empty") return;
        this.party_bar_sprite[_party_key].setTint(0xF21412);
    }


    unfocused(){
        Object.values(this.party_bar_sprite).forEach(e => e.setTint(0xFFFFFF));
    }
    
    defaultBarStyle(){
        return {
                font: "12px Arial",
                fill: "#000000",
                align: "center",
            }
    }

    update_stats() {
        let _index = 0

        for (let player_unit_name in this.party_cache_data) {
            const unit_data = this.party_cache_data[player_unit_name];
            this.party_bar_sprite[player_unit_name] = this.scene.add.sprite(this.x + 130, this.y + (80 * _index), this.party_bar);
            if(unit_data.prefab_name === "empty") {
                this.scene.add.text(this.x + 65, this.y - 30 + (_index * 80), "Empty", this.defaultBarStyle());
                _index++;
                continue
            };

            this.scene.add.sprite(this.x + 35, this.y + (80 * _index), unit_data.face);

            this.scene.add.text(this.x + 65, this.y - 30 + (_index * 80), "HP: " + unit_data.stats.health, this.defaultBarStyle());

            this.scene.add.text(this.x + 65, this.y - 16 + (_index * 80), "MP: " + unit_data.stats.mana, this.defaultBarStyle());

            this.scene.add.text(this.x + 65, this.y - 2 + (_index * 80), "XP: " + unit_data.experience, this.defaultBarStyle());

            this.scene.add.text(this.x + 65, this.y + 12 + (_index * 80), "Lvl: " + unit_data.current_level, this.defaultBarStyle());

            _index++;
        }
    }

    show(show) {
        this.player_unit_health.show(show);
        this.player_unit_mana.show(show);
        this.face_sprite.setVisible(show);
        this.level.setVisible(show);
        this.experience.setVisible(show);
    }

}

export default ShowPlayerUnit;