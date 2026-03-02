import type { DieType, DieRoll, DiceRoll, RollMode } from '../types/dice';

export const DIE_SIZES: Record<DieType, number> = {
  d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20, d100: 100,
};

export function rollSingleDie(die: DieType): DieRoll {
  const max = DIE_SIZES[die];
  const result = Math.floor(Math.random() * max) + 1;
  return {
    die,
    result,
    isMax: result === max,
    isMin: result === 1,
  };
}

export function rollDice(
  pool: Partial<Record<DieType, number>>,
  modifier: number,
  mode: RollMode,
  label?: string
): DiceRoll {
  const allDice: DieRoll[] = [];

  // Roll all dice in the pool
  for (const [die, count] of Object.entries(pool) as [DieType, number][]) {
    if (count <= 0) continue;
    // For advantage/disadvantage on a single d20, roll twice
    const rollCount = (mode !== 'normal' && die === 'd20' && count === 1) ? 2 : count;
    for (let i = 0; i < rollCount; i++) {
      allDice.push(rollSingleDie(die));
    }
  }

  let keptDice: DieRoll[] = allDice;
  let droppedDice: DieRoll[] = [];

  // Apply advantage / disadvantage to d20 if applicable
  const d20Count = pool['d20'] ?? 0;
  if (mode !== 'normal' && d20Count === 1 && allDice.length >= 2) {
    const d20s = allDice.filter((d) => d.die === 'd20');
    const others = allDice.filter((d) => d.die !== 'd20');
    if (d20s.length === 2) {
      const sorted = [...d20s].sort((a, b) =>
        mode === 'advantage' ? b.result - a.result : a.result - b.result
      );
      keptDice = [sorted[0], ...others];
      droppedDice = [sorted[1]];
    }
  }

  const rawTotal = keptDice.reduce((sum, d) => sum + d.result, 0) + modifier;
  const total = Math.max(rawTotal, 0);

  return {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    label,
    dice: allDice,
    modifier,
    total,
    mode,
    keptDice,
    droppedDice,
    isCrit: keptDice.some((d) => d.die === 'd20' && d.isMax),
    isFumble: keptDice.some((d) => d.die === 'd20' && d.isMin),
  };
}

export function quickRoll(
  die: DieType,
  count = 1,
  modifier = 0,
  mode: RollMode = 'normal',
  label?: string
): DiceRoll {
  return rollDice({ [die]: count }, modifier, mode, label);
}

export function parseDiceNotation(notation: string): { die: DieType; count: number; modifier: number } | null {
  const match = notation.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  const count = parseInt(match[1] ?? '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = parseInt(match[3] ?? '0', 10);
  const die = `d${sides}` as DieType;
  if (!DIE_SIZES[die]) return null;
  return { die, count, modifier };
}
