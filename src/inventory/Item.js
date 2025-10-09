import Prefab from "../prefabs/Prefab";

class Item extends Prefab {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);

    this.item_texture = properties.item_texture;
  }

  use() {
    console.log("Using item:", this.name);
  }
}

export default Item;
