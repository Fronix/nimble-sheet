import type { Character } from '../types/character';
import { getStatModifier, getModifierString, getSkillTotal } from './characterUtils';
import { ALL_SKILLS } from '../types/character';
import { SPELL_MAP } from '../data/spells';

export function buildPdfHtml(character: Character): string {
  const statBlock = (['STR', 'DEX', 'INT', 'WIL'] as const)
    .map(
      (s) => `
      <div class="stat-box">
        <div class="stat-label">${s}</div>
        <div class="stat-score">${character.stats[s]}</div>
        <div class="stat-mod">${getModifierString(character.stats[s])}</div>
      </div>`
    )
    .join('');

  const skillRows = ALL_SKILLS.map((skill) => {
    const total = getSkillTotal(character, skill);
    return `<tr><td>${skill}</td><td class="center">${character.skills[skill].governingStat}</td><td class="center">${total >= 0 ? '+' : ''}${total}</td></tr>`;
  }).join('');

  const saveRows = (['STR', 'DEX', 'WIL'] as const).map((s) => {
    const adv = character.savingThrows[s].advantage;
    const icon = adv === 'advantage' ? '▲' : adv === 'disadvantage' ? '▼' : '—';
    return `<tr><td>${s} Save</td><td class="center">${icon}</td></tr>`;
  }).join('');

  const inventoryRows = character.inventory.map((item) =>
    `<tr><td>${item.name}</td><td class="center">${item.category}</td><td class="center">${item.quantity}</td><td class="center">${item.slots}</td></tr>`
  ).join('');

  const spellRows = character.knownSpells.map((id) => {
    const spell = SPELL_MAP[id];
    if (!spell) return '';
    return `<tr><td>${spell.name}</td><td class="center">${spell.school}</td><td class="center">${spell.level}</td><td>${spell.description.slice(0, 80)}…</td></tr>`;
  }).join('');

  const notesHtml = character.notes.map((n) =>
    `<div class="note"><strong>${n.title}</strong><p>${n.content}</p></div>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; font-size: 12px; color: #1C1008; background: #F5E6C8; padding: 20px; }
  h1 { font-size: 24px; color: #C9A84C; text-align: center; margin-bottom: 4px; }
  h2 { font-size: 14px; color: #8B1A1A; border-bottom: 1px solid #C9A84C; margin: 12px 0 6px; text-transform: uppercase; letter-spacing: 1px; }
  .header { text-align: center; margin-bottom: 16px; }
  .meta { font-size: 11px; color: #4A3728; }
  .two-col { display: flex; gap: 16px; }
  .col { flex: 1; }
  .stat-row { display: flex; gap: 8px; margin-bottom: 12px; }
  .stat-box { border: 1px solid #C9A84C; border-radius: 4px; padding: 6px 8px; text-align: center; min-width: 52px; }
  .stat-label { font-size: 9px; font-weight: bold; color: #8B1A1A; text-transform: uppercase; }
  .stat-score { font-size: 18px; font-weight: bold; }
  .stat-mod { font-size: 11px; color: #4A3728; }
  .combat-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
  .combat-item { border: 1px solid #C9A84C; border-radius: 4px; padding: 4px 8px; text-align: center; min-width: 60px; }
  .combat-item label { display: block; font-size: 9px; text-transform: uppercase; color: #8B1A1A; }
  .combat-item span { font-size: 16px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  th { background: #C9A84C; color: #1C1008; padding: 4px 6px; text-align: left; font-size: 10px; text-transform: uppercase; }
  td { padding: 3px 6px; border-bottom: 1px solid #E0CFA0; font-size: 11px; }
  .center { text-align: center; }
  .wounds { display: flex; gap: 4px; }
  .wound-pip { width: 14px; height: 14px; border-radius: 50%; border: 1px solid #8B1A1A; }
  .wound-filled { background: #8B1A1A; }
  .note { margin-bottom: 8px; padding: 6px; border-left: 3px solid #C9A84C; background: rgba(201,168,76,0.1); }
  .note p { margin-top: 4px; font-size: 11px; }
  .conditions { font-size: 11px; color: #8B1A1A; }
</style>
</head>
<body>
<div class="header">
  <h1>${character.name}</h1>
  <div class="meta">
    ${character.class} ${character.level} · ${character.ancestry} · ${character.background}
    ${character.playerName ? `· Player: ${character.playerName}` : ''}
  </div>
</div>

<div class="two-col">
  <div class="col">
    <h2>Core Stats</h2>
    <div class="stat-row">${statBlock}</div>

    <h2>Combat</h2>
    <div class="combat-grid">
      <div class="combat-item"><label>HP</label><span>${character.hp.current}/${character.hp.max}</span></div>
      <div class="combat-item"><label>Mana</label><span>${character.mana.current}/${character.mana.max}</span></div>
      <div class="combat-item"><label>AC</label><span>${character.armorClass}</span></div>
      <div class="combat-item"><label>Speed</label><span>${character.speed}</span></div>
    </div>
    <div>Wounds: <span class="wounds">${Array.from({ length: character.maxWounds }).map((_, i) =>
      `<div class="wound-pip ${i < character.wounds ? 'wound-filled' : ''}"></div>`
    ).join('')}</span></div>
    ${character.conditions.length > 0 ? `<div class="conditions">Conditions: ${character.conditions.map((c) => c.name).join(', ')}</div>` : ''}

    <h2>Saving Throws</h2>
    <table><tr><th>Save</th><th>Advantage</th></tr>${saveRows}</table>

    <h2>Skills</h2>
    <table><tr><th>Skill</th><th>Stat</th><th>Total</th></tr>${skillRows}</table>
  </div>

  <div class="col">
    ${character.inventory.length > 0 ? `
    <h2>Inventory</h2>
    <table><tr><th>Item</th><th>Category</th><th>Qty</th><th>Slots</th></tr>${inventoryRows}</table>
    <div>Gold: ${character.currency.gold} | Silver: ${character.currency.silver} | Copper: ${character.currency.copper}</div>
    ` : ''}

    ${character.knownSpells.length > 0 ? `
    <h2>Spells</h2>
    <table><tr><th>Spell</th><th>School</th><th>Lvl</th><th>Description</th></tr>${spellRows}</table>
    ` : ''}

    ${character.features.length > 0 ? `
    <h2>Features & Traits</h2>
    ${character.features.map((f) => `<div><strong>${f.name}</strong> (${f.source}): ${f.description}</div>`).join('<br>')}
    ` : ''}
  </div>
</div>

${character.notes.length > 0 ? `<h2>Notes</h2>${notesHtml}` : ''}
</body>
</html>`;
}
