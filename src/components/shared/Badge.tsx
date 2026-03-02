import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  color?: string;
  onPress?: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color = '#C9A84C', onPress, onRemove, size = 'md' }: Props) {
  const fontSize = size === 'sm' ? 9 : 11;
  const paddingH = size === 'sm' ? 6 : 8;
  const paddingV = size === 'sm' ? 2 : 4;

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: color + '22', borderColor: color, borderWidth: 1, borderRadius: 12, paddingHorizontal: paddingH, paddingVertical: paddingV }}>
      <Text style={{ color, fontSize, fontFamily: 'IMFellEnglish-Regular' }}>{label}</Text>
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} style={{ marginLeft: 4 }}>
          <Text style={{ color, fontSize: fontSize + 2, lineHeight: fontSize + 4 }}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}
