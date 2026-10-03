import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center justify-center p-6 gap-4">
      <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center">
        <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
          <Ionicons name={icon} size={32} color="#E88D90" />
        </View>
      </View>
      <View className="items-center max-w-xs">
        <AppText variant="headline-sm" tone="ink" className="text-center">
          {title}
        </AppText>
        <AppText variant="body-md" tone="taupe" className="text-center mt-2">
          {description}
        </AppText>
      </View>
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="primary" className="mt-6" />
      )}
    </View>
  );
}
