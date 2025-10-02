import Prefab from '../Prefab';

class PhysicalAttack extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
 
        this.owner = properties.owner;
    }
    hit (target) {
        console.log(target)
        const attack_multiplier = this.scene.rnd.realInRange(0.8, 1.2);
        const defense_multiplier = this.scene.rnd.realInRange(0.8, 1.2);
        const damage = Math.max(0, Math.round((attack_multiplier * this.owner.stats.attack) - (defense_multiplier * target.stats.defense)));
        target.receive_damage(damage);
        this.owner.anims.play(this.owner.name + "_attack1");
    }
}
export default PhysicalAttack;