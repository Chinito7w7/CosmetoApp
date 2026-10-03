import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { floatShadow } from '@/src/theme/shadows';
import { useDockClearance } from '@/src/theme/layout';

interface FabProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  bottom?: number;
  accessibilityLabel?: string;
}

export function Fab({ onPress, icon = 'add', bottom, accessibilityLabel }: FabProps) {
  const dockClearance = useDockClearance();
  const finalBottom = bottom ?? dockClearance + 16;

  return (
    <Pressable 
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[{ position: 'absolute', right: 16, bottom: finalBottom }, floatShadow]}
      className="w-14 h-14 rounded-full bg-primary active:bg-primary-pressed items-center justify-center"
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
    </Pressable>
  );
}
