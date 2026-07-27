import { Scene } from "phaser";

const SLOT_POSITIONS = { party1: 53, party2: 160, party3: 267 };
const SLOT_CY = 95;
const CARD_W = 90, CARD_H = 90, CARD_COLS = 3;
const CARDS_START_X = 20, CARDS_START_Y = 210;

class HeroRosterScene extends Scene {
  constructor() {
    super({ key: "HeroRosterScene" });
  }

  init(data) {
    this.player_data = data.player_data;
    this.previous_auto = data.previous_auto;

    this.working_party = {
      party1: this.player_data.party_data.party1.hero_id,
      party2: this.player_data.party_data.party2.hero_id,
      party3: this.player_data.party_data.party3.hero_id,
    };
    this.selected_hero = null;
  }

  create() {
    this.catalog = this.cache.json.get("heroes_catalog");

    this.add.rectangle(160, 315, 320, 630, 0x000000, 0.88);

    this.add.text(160, 12, "GESTÃO DE PARTY", {
      font: "bold 15px Nunito", fill: "#ffffff",
    }).setOrigin(0.5, 0);

    this.add.text(160, 158, "── Heróis disponíveis ──", {
      font: "11px Nunito", fill: "#888888",
    }).setOrigin(0.5, 0);

    this.slot_container = this.add.container(0, 0);
    this.cards_container = this.add.container(0, 0);

    this._draw_all_slots();
    this._draw_hero_cards();
    this._draw_button(80,  605, "Cancelar", 0x553333, () => this._cancel());
    this._draw_button(240, 605, "Confirmar", 0x225522, () => this._confirm());
  }


  _draw_all_slots() {
    this.slot_container.removeAll(true);
    this.slot_objects = {};
    ["party1", "party2", "party3"].forEach((key, i) => {
      this._draw_slot(key, SLOT_POSITIONS[key], SLOT_CY);
    });
  }

  _draw_slot(slot_key, cx, cy) {
    const hero_id = this.working_party[slot_key];
    const slot_num = { party1: 1, party2: 2, party3: 3 }[slot_key];
    const W = 85, H = 110;

    const is_targeted = this.selected_hero !== null;
    const border_color = hero_id ? 0x44cc44 : (is_targeted ? 0xffff44 : 0x444444);

    const box = this.add.graphics();
    box.fillStyle(0x111111, 1);
    box.fillRect(cx - W/2, cy - H/2, W, H);
    box.lineStyle(2, border_color, 1);
    box.strokeRect(cx - W/2, cy - H/2, W, H);

    const label = this.add.text(cx, cy - H/2 - 2, `Slot ${slot_num}`, {
      font: "9px Nunito", fill: "#777777",
    }).setOrigin(0.5, 1);

    let face = null, name_text = null;
    if (hero_id) {
      const def = this.catalog[hero_id];
      face = this.add.image(cx, cy - 18, def.face).setDisplaySize(44, 44);
      name_text = this.add.text(cx, cy + 14, def.name, {
        font: "bold 10px Nunito", fill: "#ffffff",
      }).setOrigin(0.5, 0);
    } else {
      name_text = this.add.text(cx, cy, "Vazio", {
        font: "10px Nunito", fill: "#555555",
      }).setOrigin(0.5, 0.5);
    }

    const zone = this.add.zone(cx, cy, W, H).setInteractive();
    zone.on("pointerdown", () => this._on_slot_click(slot_key));
    zone.on("pointerover",  () => { box.clear(); box.fillStyle(0x222222,1).fillRect(cx-W/2,cy-H/2,W,H); box.lineStyle(2,0xffffff,1).strokeRect(cx-W/2,cy-H/2,W,H); });
    zone.on("pointerout",   () => { box.clear(); box.fillStyle(0x111111,1).fillRect(cx-W/2,cy-H/2,W,H); box.lineStyle(2,border_color,1).strokeRect(cx-W/2,cy-H/2,W,H); });

    const objs = [box, label, zone];
    if (face) objs.push(face);
    if (name_text) objs.push(name_text);
    objs.forEach(o => this.slot_container.add(o));

    this.slot_objects = this.slot_objects || {};
    this.slot_objects[slot_key] = objs;
  }

  _draw_hero_cards() {
    this.cards_container.removeAll(true);

    const in_party = new Set(Object.values(this.working_party).filter(Boolean));
    let col = 0, row = 0;

    this.player_data.owned_heroes.forEach((hero_entry) => {
      const hero_id = hero_entry.hero_id;
      const def = this.catalog[hero_id];
      if (!def) return;

      const cx = CARDS_START_X + col * (CARD_W + 5) + CARD_W / 2;
      const cy = CARDS_START_Y + row * (CARD_H + 8) + CARD_H / 2;

      const is_in_party  = in_party.has(hero_id);
      const is_selected  = this.selected_hero === hero_id;
      const border_color = is_selected ? 0xffff00 : (is_in_party ? 0x226622 : 0x444444);
      const alpha        = is_in_party && !is_selected ? 0.35 : 1;

      const box = this.add.graphics();
      box.fillStyle(0x111111, 1);
      box.fillRect(cx - CARD_W/2, cy - CARD_H/2, CARD_W, CARD_H);
      box.lineStyle(2, border_color, 1);
      box.strokeRect(cx - CARD_W/2, cy - CARD_H/2, CARD_W, CARD_H);

      const face = this.add.image(cx, cy - 16, def.face)
        .setDisplaySize(38, 38)
        .setAlpha(alpha);

      const name_t = this.add.text(cx, cy + 16, def.name, {
        font: "10px Nunito", fill: is_in_party && !is_selected ? "#555555" : "#ffffff",
      }).setOrigin(0.5, 0);

      const lvl_t = this.add.text(cx, cy + 29, `Lv.${hero_entry.current_level}`, {
        font: "9px Nunito", fill: "#aaaaaa",
      }).setOrigin(0.5, 0);

      const zone = this.add.zone(cx, cy, CARD_W, CARD_H).setInteractive();
      zone.on("pointerdown", () => this._on_card_click(hero_id));

      [box, face, name_t, lvl_t, zone].forEach(o => this.cards_container.add(o));

      col++;
      if (col >= CARD_COLS) { col = 0; row++; }
    });
  }

  _on_card_click(hero_id) {
    const in_party = Object.values(this.working_party).includes(hero_id);
    if (in_party) return;

    this.selected_hero = this.selected_hero === hero_id ? null : hero_id;
    this._draw_all_slots();
    this._draw_hero_cards();
  }

  _on_slot_click(slot_key) {
    if (this.selected_hero) {
      for (const k in this.working_party) {
        if (this.working_party[k] === this.selected_hero) {
          this.working_party[k] = null;
        }
      }
      this.working_party[slot_key] = this.selected_hero;
      this.selected_hero = null;
    } else if (this.working_party[slot_key]) {
      this.working_party[slot_key] = null;
    }
    this._draw_all_slots();
    this._draw_hero_cards();
  }

  _draw_button(cx, cy, label, color, callback) {
    const W = 120, H = 34;
    const bg = this.add.graphics();
    const _redraw = (fill) => {
      bg.clear();
      bg.fillStyle(fill, 1);
      bg.fillRoundedRect(cx - W/2, cy - H/2, W, H, 6);
    };
    _redraw(color);

    this.add.text(cx, cy, label, {
      font: "bold 13px Nunito", fill: "#ffffff",
    }).setOrigin(0.5);

    const zone = this.add.zone(cx, cy, W, H).setInteractive();
    zone.on("pointerdown", callback);
    zone.on("pointerover",  () => _redraw(Phaser.Display.Color.ValueToColor(color).brighten(30).color));
    zone.on("pointerout",   () => _redraw(color));
  }


  _confirm() {
    const has_any = Object.values(this.working_party).some(Boolean);
    if (!has_any) return;

    for (const slot_key in this.working_party) {
      const hero_id = this.working_party[slot_key];
      if (!hero_id) {
        this.player_data.party_data[slot_key] = { hero_id: null, prefab_name: "empty" };
        continue;
      }
      const hero_entry = this.player_data.getHeroData(hero_id);
      const def = this.catalog[hero_id];
      this.player_data.party_data[slot_key] = {
        hero_id,
        prefab_name: hero_id,
        stats: { ...hero_entry.stats },
        experience: hero_entry.experience,
        current_level: hero_entry.current_level,
        face: def.face,
      };
    }

    const game_scene = this.scene.get("GameScene");
    game_scene.AUTO = this.previous_auto;
    game_scene.restart_party();
    this.scene.stop("HeroRosterScene");
  }

  _cancel() {
    const game_scene = this.scene.get("GameScene");
    game_scene.AUTO = this.previous_auto;
    if (!game_scene.AUTO) {
      game_scene.prefabs.actions_menu.enable(true);
    }
    this.scene.stop("HeroRosterScene");
  }
}

export default HeroRosterScene;
