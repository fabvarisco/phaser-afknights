
export function apply_to(hero_entry, item_def) {
  for (const stat in item_def.stats_bonus) {
    if (hero_entry.stats[stat] !== undefined) {
      hero_entry.stats[stat] += item_def.stats_bonus[stat];
    }
  }
}

export function remove_from(hero_entry, item_def) {
  for (const stat in item_def.stats_bonus) {
    if (hero_entry.stats[stat] !== undefined) {
      hero_entry.stats[stat] -= item_def.stats_bonus[stat];
    }
  }
}


export function recalculate_stats(hero_entry, items_catalog) {
  hero_entry.stats = { ...hero_entry.stats_base };
  hero_entry.equipment.forEach(item_id => {
    if (item_id && items_catalog[item_id]) {
      apply_to(hero_entry, items_catalog[item_id]);
    }
  });
}
