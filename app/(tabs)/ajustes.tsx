import { View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/src/components/ui';
import { Button } from '@/src/components/ui';

export default function AjustesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-4">
      <AppText className="font-jakarta-bold text-headline-xl text-ink">Ajustes</AppText>
      <Button 
        label="Ver componentes (temporal)" 
        variant="tonal" 
        onPress={() => router.push('/componentes')} 
      />
    </View>
  );
}
