import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const bgColors = { primary: '#C9A84C', secondary: '#2D2D44', danger: '#8B1A1A', ghost: 'transparent' };
const borderColors = { primary: '#9B7A28', secondary: '#C9A84C', danger: '#C23535', ghost: '#C9A84C' };
const textColors = { primary: '#1C1008', secondary: '#C9A84C', danger: '#FFFFFF', ghost: '#C9A84C' };
const padH = { sm: 12, md: 20, lg: 28 };
const padV = { sm: 6, md: 10, lg: 14 };
const fontSizes = { sm: 10, md: 12, lg: 14 };

export default function ThemedButton({
  label, onPress, variant = 'primary', size = 'md',
  disabled = false, loading = false, fullWidth = false,
}: Props) {
  const containerStyle: ViewStyle = {
    backgroundColor: bgColors[variant],
    borderColor: borderColors[variant],
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: padH[size],
    paddingVertical: padV[size],
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.5 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  const textStyle: TextStyle = {
    color: textColors[variant],
    fontFamily: 'CinzelDecorative-Bold',
    fontSize: fontSizes[size],
    textTransform: 'uppercase',
    letterSpacing: 1,
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={containerStyle} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator size="small" color="#C9A84C" />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
