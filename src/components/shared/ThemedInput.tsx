import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'parchment' | 'stone';
}

export default function ThemedInput({ label, error, variant = 'parchment', style, ...props }: Props) {
  const inputBg = variant === 'parchment' ? '#F5E6C8' : '#2D2D44';
  const inputText = variant === 'parchment' ? '#1C1008' : '#F0C97A';
  const borderColor = error ? '#8B1A1A' : '#C9A84C';
  const placeholderColor = variant === 'parchment' ? '#7A6050' : '#7A7A9A';

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <Text style={{ fontSize: 10, fontFamily: 'CinzelDecorative-Regular', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, color: variant === 'parchment' ? '#4A3728' : '#C9A84C' }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        style={[
          {
            backgroundColor: inputBg,
            color: inputText,
            borderColor,
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontFamily: 'IMFellEnglish-Regular',
            fontSize: 14,
          },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {error ? (
        <Text style={{ color: '#C23535', fontSize: 11, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}
