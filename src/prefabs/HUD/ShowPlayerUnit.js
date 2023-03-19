import Prefab from '../Prefab';
import TextPrefab from '../TextPrefab';
import ShowStatWithBar from '../ShowStatWithBar';

class ShowPlayerUnit extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);


        this.party_bar = "party_bar";
        this.face_texture = [];
        this.face_sprite = [];
        this.unit_data = [];
        this.player_unit_health = [];
        this.player_unit_mana = [];
        this.player_unit_health = [];

        this.scene.add.sprite(this.x + 130, this.y + 20,this.party_bar)

        this.face_texture.push(this.scene.cache.game.player_data.party_data["party1"].face);
        this.face_texture.push(this.scene.cache.game.player_data.party_data["party2"].face);
        this.face_texture.push(this.scene.cache.game.player_data.party_data["party3"].face);

        this.face_sprite.push(this.scene.add.sprite(this.x + 130, this.y + 20, this.face_texture[0]));
        this.face_sprite.push(this.scene.add.sprite(this.x + 130, this.y + 100, this.face_texture[1]));
        this.face_sprite.push(this.scene.add.sprite(this.x + 130, this.y + 200, this.face_texture[2]));

        this.face_sprite[0].setOrigin(0);
        this.face_sprite[1].setOrigin(0);
        this.face_sprite[2].setOrigin(0);

        this.unit_data.push(this.scene.cache.game.player_data.party_data["party1"]);
        this.unit_data.push(this.scene.cache.game.player_data.party_data["party2"]);
        this.unit_data.push(this.scene.cache.game.player_data.party_data["party3"]);

        this.player_unit_health.push(new ShowStatWithBar(this.scene, this.name + '_health', { x: this.x, y: this.y  + 40}, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'HP', style: properties.text_style, prefab: "party1", stat: "health", bar_texture: 'healthbar_image' }));
        this.player_unit_health.push(new ShowStatWithBar(this.scene, this.name + '_health', { x: this.x, y: this.y + 140}, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'HP', style: properties.text_style, prefab: "party2", stat: "health", bar_texture: 'healthbar_image' }));
        this.player_unit_health.push(new ShowStatWithBar(this.scene, this.name + '_health', { x: this.x, y: this.y + 280}, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'HP', style: properties.text_style, prefab: "party3", stat: "health", bar_texture: 'healthbar_image' }));

        this.player_unit_mana.push(new ShowStatWithBar(this.scene, this.name + '_mana', { x: this.x, y: this.y + 30 }, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'MP', style: properties.text_style, prefab: "party1", stat: "mana", bar_texture: 'manabar_image' }));
        this.player_unit_mana.push(new ShowStatWithBar(this.scene, this.name + '_mana', { x: this.x, y: this.y + 100 }, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'MP', style: properties.text_style, prefab: "party2", stat: "mana", bar_texture: 'manabar_image' }));
        this.player_unit_mana.push(new ShowStatWithBar(this.scene, this.name + '_mana', { x: this.x, y: this.y + 200 }, { group: 'hud', anchor: { x: 0, y: 0 }, text: 'MP', style: properties.text_style, prefab: "party3", stat: "mana", bar_texture: 'manabar_image' }));
        
        debugger
        this.player_unit_health.push(this.scene.add.text(this.x, this.y + 20, "HP: " + this.scene.cache.game.player_data.party_data["party1"].stats.health, {
            font: "12px Arial",
            fill: "#ff0044",
            align: "center"
        }));

        this.levelValue = this.scene.cache.game.player_data.party_data["party3"].current_level;

        this.experienceValue = this.scene.cache.game.player_data.party_data["party3"].experience;

        this.level = this.scene.add.text(this.x + 100, this.y + 110, this.levelValue, {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        });

        this.experience = this.scene.add.text(this.x + 100, this.y + 110, this.experienceValue, {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        });

    }


    change_current_unit(new_prefab) {
        debugger
        this.unit_data = new_prefab;
        this.player_unit_health[0].unit_data = this.unit_data;
        //this.player_unit_mana.unit_data = this.unit_data;

        // this.experience.setText(this.experienceValue);
    }

    update_stats() {
        //this.unit_data = new_prefab;
        //this.player_unit_health.unit_data = this.unit_data;
        //this.player_unit_mana.unit_data = this.unit_data;
        //this.experience.setText(this.experienceValue);
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