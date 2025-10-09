import Prefab from '../Prefab';
 
class MenuItem extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.active = true;
        
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
      if (this.text) {
        this.text.setStyle({ fill: '#ff0' });
      }
      if (this.setFillStyle) {
        this.setFillStyle(0xffff00);
      }
      }
    
      enterButtonRestState() {
      if (this.text) {
        this.text.setStyle({ fill: '#0f0' });
      }
      if (this.setFillStyle) {
        this.setFillStyle(0x00ff00);
      }
      }
    
      enterButtonActiveState() {
      if (this.text) {
        this.text.setStyle({ fill: '#0ff' });
      }
      if (this.setFillStyle) {
        this.setFillStyle(0x00ffff);
      }
      }


    
}
 
export default MenuItem;