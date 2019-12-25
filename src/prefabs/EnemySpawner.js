import Prefab from './Prefab';

class EnemySpawner extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
       

        this.encounter = this.scene.cache.json.get(properties.encounter);
    }
    spawn(){
        this.scene.scene.start('BootScene', {scene: 'game', extra_parameters: {encounter: this.encounter}});

    }

}
 
export default EnemySpawner;