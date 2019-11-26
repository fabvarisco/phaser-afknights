import Prefab from './Prefab';

class Unit extends Prefab {

    constructor(scene, name, position,properties){
        super(scene,name,position,properties,properties);

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
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.idle.frames}),
                frameRate: properties.animations.idle.fps,
                repeat: -1,
                onComplete: this.back_to_idle.bind(this)
            });
        }
        
        if (!this.scene.anims.anims.has(name + '_attack2')) {
            let attack2_animation = this.scene.anims.create({
                key: name + '_attack2', 
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.idle.frames}),
                frameRate: properties.animations.idle.fps,
                repeat: -1,
                onComplete: this.back_to_idle.bind(this)
            });
        }
        
        if (!this.scene.anims.anims.has(name + '_hit')) {
            this.scene.anims.create({
                key: name + '_hit', 
                frames: this.scene.anims.generateFrameNumbers(this.texture.key, {frames: properties.animations.idle.frames}),
                frameRate: properties.animations.idle.fps,
                repeat: -1,
                onComplete: this.back_to_idle.bind(this)
            });
        }
        
        this.anims.play(name + '_idle');
        
        this.stats = properties.stats;
    }
    
    back_to_idle () {
        this.anims.play(name + '_idle');
    }

}




export default Unit;