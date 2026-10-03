import { View, Text } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function ServiciosScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>Servicios</Text>
    </View>
  );
}
