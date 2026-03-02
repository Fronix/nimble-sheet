import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { getHPPercentage, isBloodied, isDown } from '../../src/utils/characterUtils';
import type { Character } from '../../src/types/character';
import EmptyState from '../../src/components/shared/EmptyState';

function HPBar({ character }: { character: Character }) {
  const pct = getHPPercentage(character);
  const color = isDown(character) ? '#8B1A1A' : isBloodied(character) ? '#C9A84C' : '#3D7A3D';
  return (
    <View style={{ height: 4, backgroundColor: '#3D3D58', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
      <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

function CharacterCard({ character, onPress, onLongPress }: {
  character: Character;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: '#F5E6C8',
        borderColor: '#C4A96A',
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#1C1008',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 15, color: '#1C1008' }} numberOfLines={1}>
            {character.name}
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#4A3728', marginTop: 2 }}>
            {character.class} {character.level} · {character.ancestry}
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 1 }}>
            {character.background}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', minWidth: 70 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#8B1A1A', textTransform: 'uppercase' }}>HP</Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 16, color: '#1C1008' }}>
            {character.hp.current}<Text style={{ fontSize: 11, color: '#7A6050' }}>/{character.hp.max}</Text>
          </Text>
          {character.mana.max > 0 ? (
            <>
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#4A7FBF', textTransform: 'uppercase', marginTop: 4 }}>Mana</Text>
              <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#1C1008' }}>
                {character.mana.current}<Text style={{ fontSize: 10, color: '#7A6050' }}>/{character.mana.max}</Text>
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <HPBar character={character} />

      {character.conditions.length > 0 ? (
        <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 10, color: '#8B1A1A', marginTop: 6 }}>
          {character.conditions.map((c) => c.name).join(' · ')}
        </Text>
      ) : null}

      {character.wounds > 0 ? (
        <View style={{ flexDirection: 'row', marginTop: 4, gap: 3 }}>
          {Array.from({ length: character.maxWounds }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: i < character.wounds ? '#8B1A1A' : 'transparent',
                borderWidth: 1, borderColor: '#8B1A1A',
              }}
            />
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function CharacterListScreen() {
  const router = useRouter();
  const { characters, deleteCharacter, duplicateCharacter } = useCharacterStore();
  const characterList = Object.values(characters).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function handleLongPress(character: Character) {
    Alert.alert(character.name, 'What would you like to do?', [
      { text: 'Duplicate', onPress: () => duplicateCharacter(character.id) },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => Alert.alert('Delete Hero?', `Remove ${character.name} permanently?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteCharacter(character.id) },
        ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 22, color: '#C9A84C', textAlign: 'center' }}>
            Nimble Sheet
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 12, color: '#7A7A9A', textAlign: 'center', marginTop: 2 }}>
            Your party of heroes
          </Text>
        </View>

        {/* Character List */}
        {characterList.length === 0 ? (
          <EmptyState
            title="No Heroes Yet"
            subtitle="Create your first character to begin your adventure."
            actionLabel="Create Hero"
            onAction={() => router.push('/characters/new')}
          />
        ) : (
          <FlatList
            data={characterList}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <CharacterCard
                character={item}
                onPress={() => router.push(`/characters/${item.id}`)}
                onLongPress={() => handleLongPress(item)}
              />
            )}
          />
        )}

        {/* FAB */}
        {characterList.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/characters/new')}
            style={{
              position: 'absolute', bottom: 80, right: 20,
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: '#C9A84C', alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
            }}
          >
            <Text style={{ fontSize: 28, color: '#1C1008', lineHeight: 32, marginTop: -2 }}>+</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}
