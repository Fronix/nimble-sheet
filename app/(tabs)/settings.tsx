import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from 'react-native';
import * as Print from 'expo-print';
import { useCharacterStore } from '../../src/store/characterStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { exportCharacter, exportAllCharacters, importCharacters } from '../../src/utils/jsonIO';
import { buildPdfHtml } from '../../src/utils/pdfTemplate';
import GoldDivider from '../../src/components/layout/GoldDivider';

function SettingRow({ label, subtitle, children }: { label: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#F5E6C8' }}>{label}</Text>
        {subtitle ? <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginTop: 1 }}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { characters, importMany } = useCharacterStore();
  const settings = useSettingsStore();
  const [loading, setLoading] = useState<string | null>(null);

  const characterList = Object.values(characters);

  async function handleExportAll() {
    if (characterList.length === 0) {
      Alert.alert('No Characters', 'Create some heroes first before exporting.');
      return;
    }
    setLoading('export-all');
    try {
      await exportAllCharacters(characterList);
    } catch (e) {
      Alert.alert('Export Failed', String(e));
    } finally {
      setLoading(null);
    }
  }

  async function handleImport() {
    setLoading('import');
    try {
      const imported = await importCharacters();
      if (imported.length === 0) {
        Alert.alert('No Characters', 'No valid character data found in the file.');
        return;
      }
      Alert.alert(
        `Import ${imported.length} Character${imported.length !== 1 ? 's' : ''}?`,
        imported.map((c) => `• ${c.name} (${c.class} ${c.level})`).join('\n'),
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import', onPress: () => importMany(imported) },
        ]
      );
    } catch (e) {
      Alert.alert('Import Failed', String(e));
    } finally {
      setLoading(null);
    }
  }

  async function handlePrintCharacter(characterId: string) {
    const character = characters[characterId];
    if (!character) return;
    setLoading(`pdf-${characterId}`);
    try {
      const html = buildPdfHtml(character);
      await Print.printAsync({ html });
    } catch (e) {
      Alert.alert('Print Failed', String(e));
    } finally {
      setLoading(null);
    }
  }

  async function handleExportCharacter(characterId: string) {
    const character = characters[characterId];
    if (!character) return;
    setLoading(`export-${characterId}`);
    try {
      await exportCharacter(character);
    } catch (e) {
      Alert.alert('Export Failed', String(e));
    } finally {
      setLoading(null);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 20, color: '#C9A84C', textAlign: 'center' }}>The Tome</Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', textAlign: 'center', marginTop: 2 }}>Settings & Tools</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* App Settings */}
          <GoldDivider label="Preferences" />

          <SettingRow label="Dice Animations" subtitle="Animate roll results">
            <Switch
              value={settings.diceAnimations}
              onValueChange={(v) => settings.updateSettings({ diceAnimations: v })}
              trackColor={{ false: '#3D3D58', true: '#9B7A28' }}
              thumbColor={settings.diceAnimations ? '#C9A84C' : '#5A5A7A'}
            />
          </SettingRow>

          <SettingRow label="Confirm Deletes" subtitle="Ask before removing characters or items">
            <Switch
              value={settings.confirmDeletes}
              onValueChange={(v) => settings.updateSettings({ confirmDeletes: v })}
              trackColor={{ false: '#3D3D58', true: '#9B7A28' }}
              thumbColor={settings.confirmDeletes ? '#C9A84C' : '#5A5A7A'}
            />
          </SettingRow>

          {/* Import / Export All */}
          <GoldDivider label="Backup & Restore" />

          <TouchableOpacity
            onPress={handleExportAll}
            disabled={loading === 'export-all'}
            style={{ backgroundColor: '#2D2D44', borderColor: '#C9A84C', borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10 }}
          >
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1 }}>
              {loading === 'export-all' ? 'Exporting…' : 'Export All Characters'}
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginTop: 3 }}>
              Save all {characterList.length} heroes as a JSON backup file
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleImport}
            disabled={loading === 'import'}
            style={{ backgroundColor: '#2D2D44', borderColor: '#4A7FBF', borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10 }}
          >
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#4A7FBF', textTransform: 'uppercase', letterSpacing: 1 }}>
              {loading === 'import' ? 'Importing…' : 'Import Characters'}
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginTop: 3 }}>
              Load heroes from a previously exported JSON file
            </Text>
          </TouchableOpacity>

          {/* Per-character PDF export */}
          {characterList.length > 0 && (
            <>
              <GoldDivider label="Character Sheets" />
              {characterList.map((c) => (
                <View key={c.id} style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#F5E6C8', marginBottom: 8 }}>
                    {c.name} · {c.class} {c.level}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handlePrintCharacter(c.id)}
                      disabled={loading === `pdf-${c.id}`}
                      style={{ flex: 1, backgroundColor: '#8B1A1A33', borderColor: '#8B1A1A', borderWidth: 1, borderRadius: 6, padding: 8, alignItems: 'center' }}
                    >
                      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C23535', textTransform: 'uppercase' }}>
                        {loading === `pdf-${c.id}` ? 'Printing…' : 'Print PDF'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleExportCharacter(c.id)}
                      disabled={loading === `export-${c.id}`}
                      style={{ flex: 1, backgroundColor: '#C9A84C22', borderColor: '#C9A84C', borderWidth: 1, borderRadius: 6, padding: 8, alignItems: 'center' }}
                    >
                      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase' }}>
                        {loading === `export-${c.id}` ? 'Sharing…' : 'Share JSON'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* About */}
          <GoldDivider label="About" />
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 11, color: '#C9A84C' }}>Nimble Sheet</Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginTop: 4, textAlign: 'center' }}>
              A character companion for Nimble TTRPG.{'\n'}
              For use with the Nimble Core Rules.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
