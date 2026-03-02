import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Character, InventoryItem, ActiveCondition, CharacterNote, ConditionName } from '../types/character';
import { createNewCharacter } from '../types/character';

interface CharacterStore {
  characters: Record<string, Character>;

  // CRUD
  addCharacter: (partial?: Partial<Character>) => string;
  updateCharacter: (id: string, patch: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  duplicateCharacter: (id: string) => string;
  importCharacter: (character: Character) => void;
  importMany: (characters: Character[]) => void;

  // Live Play: HP
  adjustHP: (id: string, delta: number) => void;
  setCurrentHP: (id: string, value: number) => void;
  setMaxHP: (id: string, value: number) => void;
  setTempHP: (id: string, value: number) => void;

  // Live Play: Mana
  adjustMana: (id: string, delta: number) => void;
  setCurrentMana: (id: string, value: number) => void;
  setMaxMana: (id: string, value: number) => void;

  // Live Play: Wounds
  addWound: (id: string) => void;
  removeWound: (id: string) => void;
  resetWounds: (id: string) => void;

  // Conditions
  addCondition: (id: string, condition: ActiveCondition) => void;
  removeCondition: (id: string, name: ConditionName) => void;
  clearConditions: (id: string) => void;

  // Inventory
  addItem: (id: string, item: InventoryItem) => void;
  updateItem: (id: string, itemId: string, patch: Partial<InventoryItem>) => void;
  removeItem: (id: string, itemId: string) => void;

  // Notes
  addNote: (id: string, note: CharacterNote) => void;
  updateNote: (id: string, noteId: string, patch: Partial<CharacterNote>) => void;
  deleteNote: (id: string, noteId: string) => void;

  // Short / Long Rest
  shortRest: (id: string) => void;
  longRest: (id: string) => void;
}

function touch(character: Character): Character {
  return { ...character, updatedAt: new Date().toISOString() };
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: {},

      addCharacter: (partial = {}) => {
        const character = createNewCharacter(partial);
        set((state) => ({
          characters: { ...state.characters, [character.id]: character },
        }));
        return character.id;
      },

      updateCharacter: (id, patch) => {
        set((state) => {
          const existing = state.characters[id];
          if (!existing) return state;
          return {
            characters: {
              ...state.characters,
              [id]: touch({ ...existing, ...patch }),
            },
          };
        });
      },

      deleteCharacter: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.characters;
          return { characters: rest };
        });
      },

      duplicateCharacter: (id) => {
        const source = get().characters[id];
        if (!source) return id;
        const now = new Date().toISOString();
        const newChar: Character = {
          ...source,
          id: Math.random().toString(36).slice(2) + Date.now().toString(36),
          name: `${source.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          characters: { ...state.characters, [newChar.id]: newChar },
        }));
        return newChar.id;
      },

      importCharacter: (character) => {
        set((state) => ({
          characters: { ...state.characters, [character.id]: character },
        }));
      },

      importMany: (characters) => {
        set((state) => {
          const incoming = Object.fromEntries(characters.map((c) => [c.id, c]));
          return { characters: { ...state.characters, ...incoming } };
        });
      },

      // ── HP ──────────────────────────────────────────────────────────────
      adjustHP: (id, delta) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const current = Math.max(0, Math.min(c.hp.max + c.hp.temp, c.hp.current + delta));
          return { characters: { ...state.characters, [id]: touch({ ...c, hp: { ...c.hp, current } }) } };
        });
      },

      setCurrentHP: (id, value) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const current = Math.max(0, Math.min(c.hp.max + c.hp.temp, value));
          return { characters: { ...state.characters, [id]: touch({ ...c, hp: { ...c.hp, current } }) } };
        });
      },

      setMaxHP: (id, value) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const max = Math.max(1, value);
          return { characters: { ...state.characters, [id]: touch({ ...c, hp: { ...c.hp, max } }) } };
        });
      },

      setTempHP: (id, value) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, hp: { ...c.hp, temp: Math.max(0, value) } }) } };
        });
      },

      // ── Mana ────────────────────────────────────────────────────────────
      adjustMana: (id, delta) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const current = Math.max(0, Math.min(c.mana.max, c.mana.current + delta));
          return { characters: { ...state.characters, [id]: touch({ ...c, mana: { ...c.mana, current } }) } };
        });
      },

      setCurrentMana: (id, value) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const current = Math.max(0, Math.min(c.mana.max, value));
          return { characters: { ...state.characters, [id]: touch({ ...c, mana: { ...c.mana, current } }) } };
        });
      },

      setMaxMana: (id, value) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, mana: { ...c.mana, max: Math.max(0, value) } }) } };
        });
      },

      // ── Wounds ──────────────────────────────────────────────────────────
      addWound: (id) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const wounds = Math.min(c.maxWounds, c.wounds + 1);
          return { characters: { ...state.characters, [id]: touch({ ...c, wounds }) } };
        });
      },

      removeWound: (id) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const wounds = Math.max(0, c.wounds - 1);
          return { characters: { ...state.characters, [id]: touch({ ...c, wounds }) } };
        });
      },

      resetWounds: (id) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, wounds: 0 }) } };
        });
      },

      // ── Conditions ──────────────────────────────────────────────────────
      addCondition: (id, condition) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const alreadyHas = c.conditions.some((cond) => cond.name === condition.name);
          if (alreadyHas) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, conditions: [...c.conditions, condition] }) } };
        });
      },

      removeCondition: (id, name) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, conditions: c.conditions.filter((cond) => cond.name !== name) }) } };
        });
      },

      clearConditions: (id) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, conditions: [] }) } };
        });
      },

      // ── Inventory ───────────────────────────────────────────────────────
      addItem: (id, item) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, inventory: [...c.inventory, item] }) } };
        });
      },

      updateItem: (id, itemId, patch) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const inventory = c.inventory.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item
          );
          return { characters: { ...state.characters, [id]: touch({ ...c, inventory }) } };
        });
      },

      removeItem: (id, itemId) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, inventory: c.inventory.filter((item) => item.id !== itemId) }) } };
        });
      },

      // ── Notes ───────────────────────────────────────────────────────────
      addNote: (id, note) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, notes: [...c.notes, note] }) } };
        });
      },

      updateNote: (id, noteId, patch) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const notes = c.notes.map((n) =>
            n.id === noteId ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
          );
          return { characters: { ...state.characters, [id]: touch({ ...c, notes }) } };
        });
      },

      deleteNote: (id, noteId) => {
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return { characters: { ...state.characters, [id]: touch({ ...c, notes: c.notes.filter((n) => n.id !== noteId) }) } };
        });
      },

      // ── Rests ───────────────────────────────────────────────────────────
      shortRest: (id) => {
        // Short rest: heal 1 hit die worth of HP (simplified: heal 25% of max)
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          const heal = Math.floor(c.hp.max * 0.25);
          const current = Math.min(c.hp.max, c.hp.current + heal);
          return { characters: { ...state.characters, [id]: touch({ ...c, hp: { ...c.hp, current } }) } };
        });
      },

      longRest: (id) => {
        // Long rest: full HP and mana restore, clear conditions, reset wounds
        set((state) => {
          const c = state.characters[id];
          if (!c) return state;
          return {
            characters: {
              ...state.characters,
              [id]: touch({
                ...c,
                hp: { ...c.hp, current: c.hp.max },
                mana: { ...c.mana, current: c.mana.max },
                conditions: [],
                wounds: 0,
              }),
            },
          };
        });
      },
    }),
    {
      name: 'nimble-characters',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
