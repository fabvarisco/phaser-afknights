import { Scene } from "phaser";
import { apply_to, remove_from } from "../inventory/Equipment";

const SLOT_NAMES = ["Arma", "Armadura", "Capacete", "Botas", "Anel", "Amuleto"];

// Layout
const SLOT_COLS = 3;
const SLOT_W = 88, SLOT_H = 72;
const SLOTS_START_X = 16, SLOTS_START_Y = 210;
const ITEM_W = 90, ITEM_H = 90;
const ITEMS_START_X = 16, ITEMS_START_Y = 376;
const ITEM_COLS = 3;

class EquipmentScene extends Scene {
  constructor() {
    super({ key: "EquipmentScene" });
  }

  init(data) {
    this.player_data = data.player_data;
    this.selected_slot = null;   // índice 0-5 ou null
    this.selected_hero_tab = 0;  // índice dentro de party_heroes
  }

  create() {
    this.catalog = this.cache.json.get("items_catalog");

    // Montar lista de heróis na party (não-empty, na ordem dos slots)
    this.party_heroes = Object.values(this.player_data.party_data)
      .filter(slot => slot.prefab_name !== "empty")
      .map(slot => this.player_data.getHeroData(slot.hero_id))
      .filter(Boolean);

    // Fundo escuro
    this.add.rectangle(160, 315, 320, 630, 0x000000, 0.90);

    this.add.text(160, 10, "EQUIPAMENTOS", {
      font: "bold 15px Nunito", fill: "#ffffff",
    }).setOrigin(0.5, 0);

    this.tabs_container   = this.add.container(0, 0);
    this.slots_container  = this.add.container(0, 0);
    this.items_container  = this.add.container(0, 0);

    this._draw_tabs();
    this._draw_hero_info();
    this._draw_slots();
    this._draw_item_list();

    this._draw_button(160, 608, "Fechar", 0x333366, () => this._close());
  }

  // ── Tabs de herói ────────────────────────────────────────────

  _draw_tabs() {
    this.tabs_container.removeAll(true);
    const tab_w = Math.min(90, Math.floor(290 / Math.max(this.party_heroes.length, 1)));
    const heroes_catalog = this.cache.json.get("heroes_catalog");

    this.party_heroes.forEach((hero, i) => {
      const cx = 16 + i * (tab_w + 4) + tab_w / 2;
      const cy = 45;
      const is_sel = i === this.selected_hero_tab;
      const def = heroes_catalog[hero.hero_id];

      const bg = this.add.graphics();
      bg.fillStyle(is_sel ? 0x224488 : 0x222222, 1);
      bg.fillRoundedRect(cx - tab_w/2, cy - 18, tab_w, 36, 4);
      if (is_sel) { bg.lineStyle(2, 0x4488ff, 1); bg.strokeRoundedRect(cx - tab_w/2, cy - 18, tab_w, 36, 4); }

      const label = this.add.text(cx, cy, def ? def.name : hero.hero_id, {
        font: "10px Nunito", fill: is_sel ? "#ffffff" : "#888888",
      }).setOrigin(0.5);

      const zone = this.add.zone(cx, cy, tab_w, 36).setInteractive();
      zone.on("pointerdown", () => {
        this.selected_hero_tab = i;
        this.selected_slot = null;
        this._refresh();
      });

      [bg, label, zone].forEach(o => this.tabs_container.add(o));
    });
  }

  _current_hero() {
    return this.party_heroes[this.selected_hero_tab] || null;
  }

  // ── Info do herói selecionado ─────────────────────────────────

  _draw_hero_info() {
    if (this.hero_info_container) this.hero_info_container.destroy();
    this.hero_info_container = this.add.container(0, 0);

    const hero = this._current_hero();
    if (!hero) return;

    const heroes_cat = this.cache.json.get("heroes_catalog");
    const def = heroes_cat[hero.hero_id];

    const face = this.add.image(35, 113, def.face).setDisplaySize(44, 44);
    const name_t = this.add.text(66, 90, def.name, { font: "bold 12px Nunito", fill: "#ffffff" });
    const stats_t = this.add.text(66, 108,
      `ATK ${hero.stats.attack}  DEF ${hero.stats.defense}  SPD ${hero.stats.speed}`,
      { font: "10px Nunito", fill: "#aaaaaa" }
    );
    const hp_t = this.add.text(66, 122,
      `HP ${hero.stats.health}/${hero.stats.max_health}  MANA ${hero.stats.mana}`,
      { font: "10px Nunito", fill: "#aaaaaa" }
    );
    const lvl_t = this.add.text(66, 136,
      `Lv.${hero.current_level}  XP ${hero.experience}`,
      { font: "9px Nunito", fill: "#777777" }
    );

    [face, name_t, stats_t, hp_t, lvl_t].forEach(o => this.hero_info_container.add(o));
  }

  // ── Slots de equipamento ──────────────────────────────────────

  _draw_slots() {
    this.slots_container.removeAll(true);
    const hero = this._current_hero();

    this.add.text(16, 157, "Slots de equipamento:", {
      font: "10px Nunito", fill: "#888888",
    });

    for (let i = 0; i < 6; i++) {
      const col = i % SLOT_COLS, row = Math.floor(i / SLOT_COLS);
      const cx = SLOTS_START_X + col * (SLOT_W + 4) + SLOT_W / 2;
      const cy = SLOTS_START_Y + row * (SLOT_H + 4) + SLOT_H / 2;

      const equipped_id = hero ? hero.equipment[i] : null;
      const is_sel = this.selected_slot === i;
      const border_color = is_sel ? 0xffff00 : (equipped_id ? 0x4488cc : 0x444444);

      const bg = this.add.graphics();
      bg.fillStyle(0x111111, 1);
      bg.fillRect(cx - SLOT_W/2, cy - SLOT_H/2, SLOT_W, SLOT_H);
      bg.lineStyle(2, border_color, 1);
      bg.strokeRect(cx - SLOT_W/2, cy - SLOT_H/2, SLOT_W, SLOT_H);

      const slot_label = this.add.text(cx, cy - SLOT_H/2 + 6, SLOT_NAMES[i], {
        font: "9px Nunito", fill: "#666666",
      }).setOrigin(0.5, 0);

      let slot_content;
      if (equipped_id && this.catalog[equipped_id]) {
        const frame = this.catalog[equipped_id].frame ?? 12;
        slot_content = this.add.image(cx, cy + 8, "icons_spritesheet", frame)
          .setDisplaySize(28, 28)
          .setTint(0x88ddff);
      } else {
        slot_content = this.add.text(cx, cy + 8, "—", {
          font: "11px Nunito", fill: "#333333",
        }).setOrigin(0.5);
      }

      const zone = this.add.zone(cx, cy, SLOT_W, SLOT_H).setInteractive();
      zone.on("pointerdown", () => this._on_slot_click(i));
      zone.on("pointerover",  () => { bg.clear(); bg.fillStyle(0x1a1a2e,1).fillRect(cx-SLOT_W/2,cy-SLOT_H/2,SLOT_W,SLOT_H); bg.lineStyle(2,0xffffff,1).strokeRect(cx-SLOT_W/2,cy-SLOT_H/2,SLOT_W,SLOT_H); });
      zone.on("pointerout",   () => { bg.clear(); bg.fillStyle(0x111111,1).fillRect(cx-SLOT_W/2,cy-SLOT_H/2,SLOT_W,SLOT_H); bg.lineStyle(2,border_color,1).strokeRect(cx-SLOT_W/2,cy-SLOT_H/2,SLOT_W,SLOT_H); });

      [bg, slot_label, slot_content, zone].forEach(o => this.slots_container.add(o));
    }
  }

  // ── Lista de itens disponíveis ────────────────────────────────

  _draw_item_list() {
    this.items_container.removeAll(true);

    const label_y = 360;
    if (this.item_list_label) this.item_list_label.destroy();

    if (this.selected_slot === null) {
      this.item_list_label = this.add.text(16, label_y, "← Selecione um slot para ver itens", {
        font: "10px Nunito", fill: "#555555",
      });
      return;
    }

    const slot_name = SLOT_NAMES[this.selected_slot];
    this.item_list_label = this.add.text(16, label_y, `Itens para: ${slot_name}`, {
      font: "10px Nunito", fill: "#888888",
    });

    // Itens do catálogo para este slot
    const hero = this._current_hero();
    const slot_items = Object.entries(this.catalog)
      .filter(([, def]) => typeof def === "object" && def.slot === this.selected_slot);

    let col = 0, row = 0;
    slot_items.forEach(([item_id, item_def]) => {
      const cx = ITEMS_START_X + col * (ITEM_W + 4) + ITEM_W / 2;
      const cy = ITEMS_START_Y + row * (ITEM_H + 4) + ITEM_H / 2;

      const is_equipped = hero && hero.equipment[this.selected_slot] === item_id;
      const border_color = is_equipped ? 0xffaa00 : 0x444444;

      const bg = this.add.graphics();
      bg.fillStyle(is_equipped ? 0x1a1200 : 0x111111, 1);
      bg.fillRect(cx - ITEM_W/2, cy - ITEM_H/2, ITEM_W, ITEM_H);
      bg.lineStyle(2, border_color, 1);
      bg.strokeRect(cx - ITEM_W/2, cy - ITEM_H/2, ITEM_W, ITEM_H);

      const frame = item_def.frame ?? 12;
      const icon = this.add.image(cx, cy - 18, "icons_spritesheet", frame)
        .setDisplaySize(32, 32)
        .setTint(is_equipped ? 0xffaa00 : 0xffffff);

      const name_t = this.add.text(cx, cy + 10, item_def.name, {
        font: "9px Nunito", fill: is_equipped ? "#ffaa00" : "#cccccc",
        wordWrap: { width: ITEM_W - 8 }, align: "center",
      }).setOrigin(0.5, 0);

      const bonus_str = Object.entries(item_def.stats_bonus)
        .map(([s, v]) => `+${v} ${s}`).join("  ");
      const bonus_t = this.add.text(cx, cy + 28, bonus_str, {
        font: "8px Nunito", fill: "#44aa88",
        wordWrap: { width: ITEM_W - 4 }, align: "center",
      }).setOrigin(0.5, 0);

      const zone = this.add.zone(cx, cy, ITEM_W, ITEM_H).setInteractive();
      zone.on("pointerdown", () => this._on_item_click(item_id, item_def));

      [bg, icon, name_t, bonus_t, zone].forEach(o => this.items_container.add(o));

      col++;
      if (col >= ITEM_COLS) { col = 0; row++; }
    });
  }

  // ── Interações ────────────────────────────────────────────────

  _on_slot_click(slot_index) {
    const hero = this._current_hero();
    if (!hero) return;

    if (this.selected_slot === slot_index) {
      // Segundo clique no mesmo slot: desequipar se tiver item
      const current_item_id = hero.equipment[slot_index];
      if (current_item_id && this.catalog[current_item_id]) {
        remove_from(hero, this.catalog[current_item_id]);
        hero.equipment[slot_index] = null;
        this._sync_to_party_and_sprite(hero);
      }
      this.selected_slot = null;
    } else {
      this.selected_slot = slot_index;
    }

    this._refresh();
  }

  _on_item_click(item_id, item_def) {
    const hero = this._current_hero();
    if (!hero || this.selected_slot === null) return;

    const current_item_id = hero.equipment[this.selected_slot];

    // Desequipar item atual do slot se houver
    if (current_item_id && this.catalog[current_item_id]) {
      remove_from(hero, this.catalog[current_item_id]);
    }

    // Toggle: se clicar no mesmo item que já está equipado, apenas desequipa
    if (current_item_id === item_id) {
      hero.equipment[this.selected_slot] = null;
    } else {
      apply_to(hero, item_def);
      hero.equipment[this.selected_slot] = item_id;
    }

    this._sync_to_party_and_sprite(hero);
    this._refresh();
  }

  // Propaga stats atualizados para party_data e para o sprite ativo
  _sync_to_party_and_sprite(hero) {
    // Atualizar slot em party_data (para ShowPlayerUnit e rewards())
    for (const slot_key in this.player_data.party_data) {
      const slot = this.player_data.party_data[slot_key];
      if (slot.hero_id === hero.hero_id) {
        slot.stats = { ...hero.stats };
      }
    }

    // Atualizar sprite ativo na GameScene
    const game_scene = this.scene.get("GameScene");
    if (game_scene) {
      const sprite = game_scene.prefabs[hero.hero_id];
      if (sprite && sprite.active) {
        sprite.stats = { ...hero.stats };
      }
      game_scene.prefabs.show_player_unit.update_stats();
    }
  }

  _refresh() {
    this._draw_tabs();
    this._draw_hero_info();
    this._draw_slots();
    this._draw_item_list();
  }

  // ── Botão fechar ──────────────────────────────────────────────

  _draw_button(cx, cy, label, color, callback) {
    const W = 140, H = 32;
    const bg = this.add.graphics();
    const _r = (fill) => { bg.clear(); bg.fillStyle(fill, 1); bg.fillRoundedRect(cx - W/2, cy - H/2, W, H, 6); };
    _r(color);
    this.add.text(cx, cy, label, { font: "bold 13px Nunito", fill: "#ffffff" }).setOrigin(0.5);
    const zone = this.add.zone(cx, cy, W, H).setInteractive();
    zone.on("pointerdown", callback);
    zone.on("pointerover",  () => _r(0x4444aa));
    zone.on("pointerout",   () => _r(color));
  }

  _close() {
    const game_scene = this.scene.get("GameScene");
    if (game_scene && !game_scene.AUTO) {
      game_scene.prefabs.actions_menu.enable(true);
    }
    this.scene.stop("EquipmentScene");
  }
}

export default EquipmentScene;
