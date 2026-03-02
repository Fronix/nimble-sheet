import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import type { CharacterNote } from '../../../src/types/character';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const character = useCharacterStore((s) => s.characters[id]);
  const store = useCharacterStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editNote, setEditNote] = useState<CharacterNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!character) return null;

  const sortedNotes = [...character.notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function openAdd() {
    setEditNote(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  }

  function openEdit(note: CharacterNote) {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  }

  function handleSave() {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    const now = new Date().toISOString();
    if (editNote) {
      store.updateNote(id, editNote.id, { title: title.trim(), content, updatedAt: now });
    } else {
      store.addNote(id, { id: makeId(), title: title.trim(), content, createdAt: now, updatedAt: now });
    }
    setModalVisible(false);
  }

  function handleDelete(noteId: string, noteTitle: string) {
    Alert.alert('Delete Note?', `Remove "${noteTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => store.deleteNote(id, noteId) },
    ]);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 15, color: '#C9A84C' }}>Session Notes</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
          {sortedNotes.length === 0 ? (
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#5A5A7A', textAlign: 'center', marginVertical: 20 }}>
              No notes yet. Tap + to record your adventures.
            </Text>
          ) : (
            sortedNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => openEdit(note)}
                onLongPress={() => handleDelete(note.id, note.title)}
                style={{ backgroundColor: '#F5E6C8', borderColor: '#C4A96A', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: '#1C1008', flex: 1 }} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 9, color: '#7A6050', marginLeft: 8 }}>
                    {formatDate(note.updatedAt)}
                  </Text>
                </View>
                <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#4A3728', lineHeight: 18 }} numberOfLines={3}>
                  {note.content || 'No content'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          onPress={openAdd}
          style={{ position: 'absolute', bottom: 70, right: 18, width: 50, height: 50, borderRadius: 25, backgroundColor: '#C9A84C', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6 }}
        >
          <Text style={{ fontSize: 26, color: '#1C1008', lineHeight: 30, marginTop: -2 }}>+</Text>
        </TouchableOpacity>

        {/* Note Modal */}
        <Modal visible={modalVisible} transparent={false} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomColor: '#C9A84C', borderBottomWidth: 1 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 6 }}>
                  <Text style={{ color: '#C9A84C', fontSize: 16 }}>← Back</Text>
                </TouchableOpacity>
                <Text style={{ flex: 1, fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: '#C9A84C', textAlign: 'center' }}>
                  {editNote ? 'Edit Note' : 'New Note'}
                </Text>
                <TouchableOpacity onPress={handleSave} style={{ padding: 6 }}>
                  <Text style={{ color: '#3D7A3D', fontFamily: 'CinzelDecorative-Regular', fontSize: 12 }}>Save</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Note title..."
                placeholderTextColor="#5A5A7A"
                style={{ paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'CinzelDecorative-Regular', fontSize: 16, color: '#F0C97A', borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}
              />
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Write your notes here..."
                placeholderTextColor="#5A5A7A"
                multiline
                textAlignVertical="top"
                style={{ flex: 1, padding: 16, fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#F5E6C8', lineHeight: 22 }}
              />
              {editNote && (
                <TouchableOpacity
                  onPress={() => { handleDelete(editNote.id, editNote.title); setModalVisible(false); }}
                  style={{ padding: 14, alignItems: 'center', borderTopColor: '#3D3D58', borderTopWidth: 1 }}
                >
                  <Text style={{ color: '#8B1A1A', fontFamily: 'IMFellEnglish-Regular', fontSize: 13 }}>Delete Note</Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
