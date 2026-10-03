import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Card } from './Card';
import { Colors } from '@/src/theme/colors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  caption?: string;
  tone: 'primary' | 'success' | 'warning';
}

const toneConfig = {
  primary: { bg: 'bg-primary/15', color: Colors.primary },
  success: { bg: 'bg-success-bg', color: Colors.success },
  warning: { bg: 'bg-warning-bg', color: Colors.warning },
};

export function StatCard({ icon, label, value, caption, tone }: StatCardProps) {
  const { bg, color } = toneConfig[tone];
  
  return (
    <Card className="p-3 flex-1">
      <View className={`w-7 h-7 rounded-md ${bg} items-center justify-center mb-2`}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View className="flex-row items-baseline gap-1">
        <AppText variant="headline-lg" tone="ink">{value}</AppText>
        {caption && <AppText variant="body-sm" tone="taupe">{caption}</AppText>}
      </View>
      <AppText variant="body-sm" tone="taupe">{label}</AppText>
    </Card>
  );
}
