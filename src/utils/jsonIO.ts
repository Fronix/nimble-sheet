import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import type { Character } from '../types/character';

export async function exportCharacter(character: Character): Promise<void> {
  const json = JSON.stringify(character, null, 2);
  const filename = `${character.name.replace(/\s+/g, '_')}_nimble.json`;
  const file = new File(Paths.cache, filename);
  file.write(json);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: `Share ${character.name}`,
    });
  }
}

export async function exportAllCharacters(characters: Character[]): Promise<void> {
  const json = JSON.stringify(characters, null, 2);
  const file = new File(Paths.cache, 'nimble_characters_backup.json');
  file.write(json);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export All Characters',
    });
  }
}

export async function importCharacters(): Promise<Character[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled) return [];

  const asset = result.assets[0];
  if (!asset?.uri) return [];

  const file = new File(asset.uri);
  const raw = await file.text();
  const parsed = JSON.parse(raw);
  const characters: Character[] = Array.isArray(parsed) ? parsed : [parsed];

  const now = new Date().toISOString();
  return characters.map((c) => ({
    ...c,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    updatedAt: now,
  }));
}
