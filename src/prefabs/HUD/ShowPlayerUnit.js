import Prefab from '../Prefab';
class ShowPlayerUnit extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.party_bar = "party_bar";
        this.face_texture = [];
        this.face_sprite = [];
        this.unit_data = [];
        this.update_stats();

    }


    change_current_unit(new_prefab) {
        //this.unit_data = new_prefab;
        //this.player_unit_health[0].unit_data = this.unit_data;
        //this.player_unit_mana.unit_data = this.unit_data;

        // this.experience.setText(this.experienceValue);
    }

    update_stats() {
        const party_data = this.scene.cache.game.player_data.party_data;
        let _index = 0

        for (let player_unit_name in party_data) {
            const unit_data = party_data[player_unit_name];
            this.scene.add.sprite(this.x + 130, this.y + (80 * _index), this.party_bar);
            this.scene.add.sprite(this.x + 35, this.y + (80 * _index), unit_data.face);

            this.scene.add.text(this.x + 65, this.y - 30 + ( _index * 80), "HP: " + unit_data.stats.health, {
                font: "12px Arial",
                fill: "#000000",
                align: "center",
            });

            this.scene.add.text(this.x + 65, this.y - 16 + ( _index * 80), "MP: " + unit_data.stats.mana, {
                font: "12px Arial",
                fill: "#000000",
                align: "center",
            });

            this.scene.add.text(this.x + 65, this.y - 2 + ( _index * 80), "XP: " + unit_data.experience, {
                font: "12px Arial",
                fill: "#000000",
                align: "center",
            });

            this.scene.add.text(this.x + 65, this.y + 12 + ( _index * 80), "Lvl: " + unit_data.current_level, {
                font: "12px Arial",
                fill: "#000000",
                align: "center",
            });



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