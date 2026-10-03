import { View, Text } from 'react-native';

export default function AgendaScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl text-ink">Agenda</Text>
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
    </View>
  );
}
