import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Fab } from '@/src/components/ui';
import { AppText } from '@/src/components/ui';
import { useDockClearance } from '@/src/theme/layout';

export default function AgendaScreen() {
  const dockClearance = useDockClearance();

  return (
    <ScrollView 
      className="flex-1 bg-background" 
      contentContainerStyle={{ paddingBottom: dockClearance + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-6 gap-4">
        <AppText variant="headline-xl" tone="ink" className="mb-4">Agenda</AppText>
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="mb-3">
            <AppText variant="body-md" tone="ink">Turno de ejemplo {i + 1}</AppText>
          </Card>
        ))}
      </View>
      <Fab icon="add" onPress={() => {}} />
    </ScrollView>
  );
}
