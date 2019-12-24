import Prefab from '../Prefab';
 
class MenuItem extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        
        this.setInteractive();
        this.on('pointerdown', () => this.enterButtonActiveState() );
        this.on('pointerover', () => this.enterButtonHoverState() )
        this.on('pointerout', () => this.enterButtonRestState() )
        this.on('pointerup', () =>{
            this.select();
            this.enterButtonHoverState();
        });


    }
    
    select () {
        console.log(this.name + ' selected');
    }

    enterButtonHoverState() {
        console.log(this.name + ' HoverState');
        //this.properties.style = '#ff0';
      }
    
      enterButtonRestState() {
        console.log(this.name + ' RestState');

        //this.properties.style = '#0f0';
      }
    
      enterButtonActiveState() {
        console.log(this.name + ' ActiveState');

        //this.properties.style = '#0ff';
      }
    
}
 
export default MenuItem;