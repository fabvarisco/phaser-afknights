import MenuItem from './MenuItem';

const CARD = 44;

class ItemMenuItem extends MenuItem {
  constructor(scene, name, position, properties) {
    super(scene, name, position, properties);

    this.item_name = properties.item_name;
    this.amount = properties.amount || 0;

    this._card_x = position.x;
    this._card_y = position.y;

    this.bg_graphic = scene.add.graphics().setDepth(this.depth - 1);
    this._draw_bg(0x444444);

    this.setDisplaySize(CARD - 10, CARD - 10);

    this.amount_text = scene.add.text(
      this._card_x + CARD - 2, this._card_y + CARD - 2,
      `x${this.amount}`,
      { font: "bold 9px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 2 }
    ).setOrigin(1, 1);
  }

  _draw_bg(border_color) {
    if (!this.bg_graphic) return;
    this.bg_graphic.clear();
    this.bg_graphic.fillStyle(0x111111, 0.92);
    this.bg_graphic.fillRect(this._card_x, this._card_y, CARD, CARD);
    this.bg_graphic.lineStyle(2, border_color, 1);
    this.bg_graphic.strokeRect(this._card_x, this._card_y, CARD, CARD);
  }

  enterButtonHoverState()  { this._draw_bg(0xffff00); }
  enterButtonRestState()   { this._draw_bg(0x444444); }
  enterButtonActiveState() { this._draw_bg(0x00ffff); }

  select() {
    if (this.scene.cache.game.player_data.inventory.has_item(this.item_name)) {
      this.scene.prefabs.items_menu.enable(false);

      this.scene.cache.game.player_data.inventory.use_item(this.item_name, this.scene.current_unit);
      this.scene.prefabs.show_player_unit.update_stats();

      if (!this.scene.cache.game.player_data.inventory.has_item(this.item_name)) {
        const scene = this.scene;
        this.destroy();
        scene.nextTurn();
      } else {
        this.amount = this.scene.cache.game.player_data.inventory.items[this.item_name].amount;
        if (this.amount_text) this.amount_text.setText(`x${this.amount}`);
        this.scene.nextTurn();
      }
    }
  }

  destroy(fromScene) {
    if (this.amount_text) { this.amount_text.destroy(); this.amount_text = null; }
    if (this.bg_graphic) { this.bg_graphic.destroy(); this.bg_graphic = null; }
    super.destroy(fromScene);
  }
}

export default ItemMenuItem;
