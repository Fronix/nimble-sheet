import type { BackgroundName } from '../types/character';

export interface BackgroundData {
  name: BackgroundName;
  description: string;
  skillBonus: string;
  startingGold: number;
}

export const BACKGROUNDS: BackgroundData[] = [
  { name: 'Acolyte', description: 'You spent years in service to a temple, learning the rites of your faith.', skillBonus: '+2 Insight', startingGold: 15 },
  { name: 'Apothecary', description: 'You mixed potions, herbs, and remedies in a healer\'s shop.', skillBonus: '+2 Lore', startingGold: 25 },
  { name: 'Charlatan', description: 'You made a living through deception, cons, and silver-tongued lies.', skillBonus: '+2 Influence', startingGold: 15 },
  { name: 'Criminal', description: 'You survived on the wrong side of the law, learning the trade of villainy.', skillBonus: '+2 Stealth', startingGold: 15 },
  { name: 'Entertainer', description: 'You performed for crowds, mastering song, dance, or acrobatics.', skillBonus: '+2 Influence', startingGold: 15 },
  { name: 'Farmer', description: 'You worked the land, learning the patience and strength of honest labor.', skillBonus: '+2 Naturecraft', startingGold: 10 },
  { name: 'Folk Hero', description: 'You rose from humble origins to become a champion of common folk.', skillBonus: '+2 Athletics', startingGold: 10 },
  { name: 'Gladiator', description: 'You fought in arenas for coin and glory, mastering combat as spectacle.', skillBonus: '+2 Athletics', startingGold: 20 },
  { name: 'Guard', description: 'You served as a watchman or soldier in a city or estate.', skillBonus: '+2 Perception', startingGold: 10 },
  { name: 'Guild Artisan', description: 'You learned a skilled trade under the guidance of a guild.', skillBonus: '+2 Examination', startingGold: 25 },
  { name: 'Hermit', description: 'You lived in isolation, discovering ancient secrets or spiritual truth.', skillBonus: '+2 Lore', startingGold: 5 },
  { name: 'Hunter', description: 'You tracked and hunted beasts across the wilderness for survival or sport.', skillBonus: '+2 Naturecraft', startingGold: 10 },
  { name: 'Knight', description: 'You trained in chivalric tradition, sworn to a lord or noble ideal.', skillBonus: '+2 Influence', startingGold: 20 },
  { name: 'Merchant', description: 'You traded goods and negotiated deals across city and road.', skillBonus: '+2 Influence', startingGold: 35 },
  { name: 'Noble', description: 'You were born to privilege, power, and the expectations that come with them.', skillBonus: '+2 Influence', startingGold: 50 },
  { name: 'Outlander', description: 'You grew up far from civilization, surviving by instinct and skill.', skillBonus: '+2 Naturecraft', startingGold: 10 },
  { name: 'Sage', description: 'You devoted your life to scholarship, filling your mind with ancient knowledge.', skillBonus: '+2 Arcana', startingGold: 10 },
  { name: 'Sailor', description: 'You worked the seas, navigating storms and distant ports.', skillBonus: '+2 Athletics', startingGold: 10 },
  { name: 'Scholar', description: 'You studied at a university or under a learned mentor.', skillBonus: '+2 Lore', startingGold: 10 },
  { name: 'Smuggler', description: 'You moved contraband across borders, staying one step ahead of the law.', skillBonus: '+2 Stealth', startingGold: 20 },
  { name: 'Soldier', description: 'You served in an army, learning discipline, tactics, and survival.', skillBonus: '+2 Athletics', startingGold: 10 },
  { name: 'Spy', description: 'You gathered intelligence in the shadows, serving powerful masters.', skillBonus: '+2 Finesse', startingGold: 15 },
  { name: 'Urchin', description: 'You survived on city streets through wit, speed, and desperation.', skillBonus: '+2 Stealth', startingGold: 10 },
  { name: 'Wanderer', description: 'You roamed freely, collecting stories and wisdom from countless roads.', skillBonus: '+2 Perception', startingGold: 10 },
];
