import Prefab from './Prefab';

class Unit extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        if (!this.scene.anims.anims.has(name + '_idle')) {
            this.scene.anims.create({
                key: name + '_idle',
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.idle.frames}),
                frameRate: properties.animations.idle.fps,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.anims.has(name + '_attack1')) {
            this.scene.anims.create({
                key: name + '_attack1',
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.attack1.frames}),
                frameRate: properties.animations.attack1.fps
            });
        }
        
        if (!this.scene.anims.anims.has(name + '_attack2')) {
            this.scene.anims.create({
                key: name + '_attack2',
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.attack2.frames}),
                frameRate: properties.animations.attack2.fps
            });
        }
        
        if (!this.scene.anims.anims.has(name + '_hit')) {
            this.scene.anims.create({
                key: name + '_hit',
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.hit.frames}),
                frameRate: properties.animations.hit.fps
            });
        }
        
        this.on('animationcomplete', this.back_to_idle.bind(this));
        
        this.anims.play(name + '_idle');
        
        this.stats = properties.stats;
        
        this.target_units = properties.target_units;
    }
    
    back_to_idle () {
        this.anims.play(this.name + '_idle');
    }
    
    act () {
        let target = this.choose_target();
        
        let attack_multiplier = this.scene.rnd.realInRange(0.8, 1.2);
        let defense_multiplier = this.scene.rnd.realInRange(0.8, 1.2);
        
        let damage = Math.max(0, Math.round((attack_multiplier * this.stats.attack) - (defense_multiplier * target.stats.defense)));
        
        target.receive_damage(damage);
        
        this.anims.play(this.name + '_attack1');
    }
    
    choose_target() {
        let target = undefined;
        let target_index = this.scene.rnd.between(0, this.scene.groups[this.target_units].countActive() - 1);
        let alive_player_unit_index = 0;
        this.scene.groups[this.target_units].children.each(function (unit) {
            if (unit.active) {
                if (alive_player_unit_index === target_index) {
                    target = unit;
                }
                alive_player_unit_index += 1;
            }
        }, this);
        return target;
    }
    
    receive_damage(damage) {
        this.stats.health -= damage;
        this.anims.play(this.name + '_hit');
        if (this.stats.health <= 0) {
            this.stats.health = 0;
            this.destroy();
        }
        
        let damage_text = this.scene.add.text(this.x, this.y - 50, "" + damage, this.scene.groups.hud);
        this.timed_event = this.scene.time.addEvent({delay: 1000, callback: damage_text.destroy, callbackScope: damage_text});
    }
    
    calculate_act_turn (current_turn) {
        this.act_turn = current_turn + Math.ceil(100 / this.stats.speed);
    }
}

export default Unit;