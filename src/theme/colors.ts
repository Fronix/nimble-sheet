export const colors = {
  // Parchment theme
  parchment: '#F5E6C8',
  parchmentDark: '#E0CFA0',
  parchmentBorder: '#C4A96A',

  // Stone theme
  stone: '#1A1A2E',
  stoneMid: '#2D2D44',
  stoneLight: '#3D3D58',
  stoneBorder: '#5A5A7A',

  // Accents
  gold: '#C9A84C',
  goldLight: '#F0C97A',
  goldDark: '#9B7A28',

  // Status
  crimson: '#8B1A1A',
  crimsonLight: '#C23535',
  hpGreen: '#3D7A3D',
  hpLight: '#5FA85F',
  manaBlue: '#4A7FBF',
  manaLight: '#7AAAD6',

  // Text
  inkDark: '#1C1008',
  inkMid: '#4A3728',
  inkLight: '#7A6050',

  // Neutral
  white: '#FFFFFF',
  offWhite: '#F8F4EC',
  gray: '#888888',
} as const;

export type ThemeColors = typeof colors;
