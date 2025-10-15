import Prefab from '../Prefab';
 
class Menu extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        this.menu_items = {};
        for (let menu_item_name in properties.menu_items) {
            this.menu_items[menu_item_name] = this.scene.create_prefab(menu_item_name, properties.menu_items[menu_item_name]);
        }
        this.enable(false);
    }
    
    enable (enable) {
        Object.values(this.menu_items).forEach(function(menu_item) {
            if(menu_item.active){
                menu_item.setInteractive(enable);
                menu_item.setVisible(enable);
            }
            if(menu_item.name === "back"){
                menu_item.setInteractive(false);
                menu_item.setVisible(false);
            }
            
        }, this);
    }
    enableSpecific (enable,_value) {
        // console.log("Enabling menu item:",_value,enable);
        // this.menu_items[_value].active = enable;
        // this.menu_items[_value].setInteractive(enable);
        // this.menu_items[_value].setVisible(enable);
        // console.log("menu item:",this.menu_items);
    }

    enableBack(show){
         Object.values(this.menu_items).forEach(function(menu_item) {
            if(menu_item.name === "back"){
                menu_item.setInteractive(show);
                menu_item.setVisible(show);
            }
        }, this);
    }
    

    autoBattleEnable(){
        this.menu_items.forEach(function(menu_item) {
            if(menu_item.name !== "autobattle"){
                menu_item.setInteractive(false);
                menu_item.setVisible(false);
            }
        }, this);
    }
}
 
export default Menu;