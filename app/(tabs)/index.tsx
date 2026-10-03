import { View, Text } from 'react-native';

export default function AgendaScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-jakarta-bold text-headline-xl text-ink">Agenda</Text>
      <View className="flex-row gap-2 mt-4">
        <View className="bg-skincare px-3 py-1 rounded-full">
          <Text className="text-ink">Cosmetología</Text>
        </View>
        <View className="bg-makeup px-3 py-1 rounded-full">
          <Text className="text-ink">Maquillaje</Text>
        </View>
        <View className="bg-nails px-3 py-1 rounded-full">
          <Text className="text-ink">Uñas</Text>
        </View>
      </View>
      <View className="mt-6 items-center gap-2">
        <Text className="font-jakarta-bold text-headline-lg text-ink">Headline</Text>
        <Text className="font-jakarta text-body-md text-taupe">Texto de cuerpo de prueba</Text>
        <Text className="font-jakarta-semibold text-label-sm text-taupe">ETIQUETA</Text>
      </View>
    </View>
  );
}
