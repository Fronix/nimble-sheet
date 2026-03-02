import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import { getInventorySlotMax, getInventorySlotsUsed } from '../../../src/utils/characterUtils';
import type { InventoryItem, ItemCategory } from '../../../src/types/character';

const CATEGORIES: ItemCategory[] = ['Weapon', 'Armor', 'Shield', 'Tool', 'Consumable', 'Treasure', 'Misc'];
const CATEGORY_COLORS: Record<ItemCategory, string> = {
  Weapon: '#C23535', Armor: '#4A7FBF', Shield: '#9B7A28', Tool: '#3D7A3D',
  Consumable: '#7A4A9A', Treasure: '#C9A84C', Misc: '#5A5A7A',
};

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_ITEM: Omit<InventoryItem, 'id'> = {
  name: '', category: 'Misc', slots: 1, quantity: 1, equipped: false,
};

export default function InventoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const character = useCharacterStore((s) => s.characters[id]);
  const store = useCharacterStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<Omit<InventoryItem, 'id'>>(DEFAULT_ITEM);
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'All'>('All');

  if (!character) return null;

  const slotMax = getInventorySlotMax(character);
  const slotUsed = getInventorySlotsUsed(character);
  const slotPct = slotMax > 0 ? Math.min(1, slotUsed / slotMax) : 0;

  function openAdd() {
    setEditItem(null);
    setForm(DEFAULT_ITEM);
    setModalVisible(true);
  }

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    const { id: _id, ...rest } = item;
    setForm(rest);
    setModalVisible(true);
  }

  function handleSave() {
    if (!form.name.trim()) { Alert.alert('Name required'); return; }
    if (editItem) {
      store.updateItem(id, editItem.id, form);
    } else {
      store.addItem(id, { id: makeId(), ...form });
    }
    setModalVisible(false);
  }

  function handleDelete(itemId: string, itemName: string) {
    Alert.alert('Remove Item?', `Remove ${itemName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => store.removeItem(id, itemId) },
    ]);
  }

  const filteredItems = filterCategory === 'All'
    ? character.inventory
    : character.inventory.filter((i) => i.category === filterCategory);

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Slot bar */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1 }}>
              Inventory Slots
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: slotPct >= 1 ? '#C23535' : '#F5E6C8' }}>
              {slotUsed} / {slotMax}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#2D2D44', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${slotPct * 100}%`, backgroundColor: slotPct >= 1 ? '#8B1A1A' : slotPct >= 0.8 ? '#C9A84C' : '#3D7A3D', borderRadius: 4 }} />
          </View>
        </View>

        {/* Currency */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 12 }}>
          {[
            { label: 'Gold', key: 'gold' as const, color: '#C9A84C' },
            { label: 'Silver', key: 'silver' as const, color: '#AAAAAA' },
            { label: 'Copper', key: 'copper' as const, color: '#C87941' },
          ].map(({ label, key, color }) => (
            <View key={key} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2D2D44', borderRadius: 6, padding: 6, borderColor: color + '44', borderWidth: 1 }}>
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 8, color, textTransform: 'uppercase' }}>{label}</Text>
              <TouchableOpacity onPress={() => store.updateCharacter(id, { currency: { ...character.currency, [key]: Math.max(0, character.currency[key] - 1) } })}>
                <Text style={{ color, fontSize: 14 }}>−</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8', flex: 1, textAlign: 'center' }}>{character.currency[key]}</Text>
              <TouchableOpacity onPress={() => store.updateCharacter(id, { currency: { ...character.currency, [key]: character.currency[key] + 1 } })}>
                <Text style={{ color, fontSize: 14 }}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4, gap: 6 }}>
          {(['All', ...CATEGORIES] as (ItemCategory | 'All')[]).map((cat) => {
            const color = cat === 'All' ? '#C9A84C' : CATEGORY_COLORS[cat];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilterCategory(cat)}
                style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: color, backgroundColor: filterCategory === cat ? color + '33' : 'transparent' }}
              >
                <Text style={{ color, fontFamily: 'CinzelDecorative-Regular', fontSize: 8, textTransform: 'uppercase' }}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
          {filteredItems.length === 0 ? (
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#5A5A7A', textAlign: 'center', marginVertical: 20 }}>
              No items. Tap + to add equipment.
            </Text>
          ) : (
            filteredItems.map((item) => {
              const color = CATEGORY_COLORS[item.category];
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => openEdit(item)}
                  onLongPress={() => handleDelete(item.id, item.name)}
                  style={{ backgroundColor: '#2D2D44', borderColor: color + '55', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#F5E6C8' }}>{item.name}</Text>
                      {item.equipped && (
                        <View style={{ backgroundColor: '#3D7A3D33', borderColor: '#3D7A3D', borderWidth: 1, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 }}>
                          <Text style={{ color: '#3D7A3D', fontSize: 8, fontFamily: 'CinzelDecorative-Regular' }}>EQUIPPED</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 10, color }}>
                      {item.category}{item.damage ? ` · ${item.damage}` : ''}{item.armorValue ? ` · AC+${item.armorValue}` : ''}
                    </Text>
                    {item.description ? <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 10, color: '#7A6050', marginTop: 2 }}>{item.description}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'center', marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 11, color: '#F5E6C8' }}>×{item.quantity}</Text>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 9, color: '#7A7A9A' }}>{item.slots}sl</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          onPress={openAdd}
          style={{ position: 'absolute', bottom: 70, right: 18, width: 50, height: 50, borderRadius: 25, backgroundColor: '#C9A84C', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6 }}
        >
          <Text style={{ fontSize: 26, color: '#1C1008', lineHeight: 30, marginTop: -2 }}>+</Text>
        </TouchableOpacity>

        {/* Add/Edit Modal */}
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000088' }} onPress={() => setModalVisible(false)} />
          <View style={{ backgroundColor: '#1A1A2E', borderTopColor: '#C9A84C', borderTopWidth: 1, padding: 16 }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 14, color: '#C9A84C', marginBottom: 12 }}>
              {editItem ? 'Edit Item' : 'Add Item'}
            </Text>
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
              placeholder="Item name"
              placeholderTextColor="#5A5A7A"
              style={{ backgroundColor: '#2D2D44', borderColor: '#C9A84C', borderWidth: 1, borderRadius: 4, padding: 10, color: '#F5E6C8', fontFamily: 'IMFellEnglish-Regular', fontSize: 14, marginBottom: 8 }}
            />
            {/* Category picker */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 8 }}>
              {CATEGORIES.map((cat) => {
                const color = CATEGORY_COLORS[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setForm((f) => ({ ...f, category: cat }))}
                    style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: color, backgroundColor: form.category === cat ? color + '44' : 'transparent' }}
                  >
                    <Text style={{ color, fontFamily: 'CinzelDecorative-Regular', fontSize: 9 }}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {/* Quantity & slots */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
              {[
                { label: 'Quantity', key: 'quantity' as const, min: 0 },
                { label: 'Slots', key: 'slots' as const, min: 0 },
              ].map(({ label, key, min }) => (
                <View key={key} style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 8, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2D2D44', borderRadius: 4, borderWidth: 1, borderColor: '#5A5A7A' }}>
                    <TouchableOpacity onPress={() => setForm((f) => ({ ...f, [key]: Math.max(min, (f[key] as number) - 1) }))} style={{ padding: 8 }}>
                      <Text style={{ color: '#C9A84C', fontSize: 16 }}>−</Text>
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'center', color: '#F5E6C8', fontFamily: 'IMFellEnglish-Regular', fontSize: 14 }}>{form[key] as number}</Text>
                    <TouchableOpacity onPress={() => setForm((f) => ({ ...f, [key]: (f[key] as number) + 1 }))} style={{ padding: 8 }}>
                      <Text style={{ color: '#C9A84C', fontSize: 16 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <TextInput
              value={form.description ?? ''}
              onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
              placeholder="Description (optional)"
              placeholderTextColor="#5A5A7A"
              style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 4, padding: 8, color: '#F5E6C8', fontFamily: 'IMFellEnglish-Regular', fontSize: 12, marginBottom: 8 }}
            />
            {/* Equipped toggle */}
            <TouchableOpacity
              onPress={() => setForm((f) => ({ ...f, equipped: !f.equipped }))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}
            >
              <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#3D7A3D', backgroundColor: form.equipped ? '#3D7A3D' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {form.equipped && <Text style={{ color: '#F5E6C8', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>Equipped</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: '#C9A84C', borderRadius: 6, padding: 12, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 12, color: '#1C1008', textTransform: 'uppercase' }}>
                {editItem ? 'Save Changes' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
