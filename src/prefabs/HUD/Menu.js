import Prefab from '../Prefab';
import menuItem from "./MenuItem";
 
class Menu extends Prefab {
    constructor(scene, name, position, properties) {
        super(scene, name, position, properties);
        console.log("Creating menu:", name);
        console.log("Menu properties:", properties);
        this.menu_items = [];
        for (let menu_item_name in properties.menu_items) {
            var new_item = this.scene.create_prefab(menu_item_name, properties.menu_items[menu_item_name]);
            this.menu_items.push(new_item);
        }

        this.enable(false);
    }
    
    enable (enable) {
        this.menu_items.forEach(function(menu_item) {
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
        console.log("Enabling menu item:",_value,enable);
        this.menu_items[_value].setInteractive(enable);
        this.menu_items[_value].setVisible(enable);
    }

    enableBack(show){
        this.menu_items.forEach(function(menu_item) {
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