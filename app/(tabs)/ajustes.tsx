import { View, Text } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function AjustesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <Text style={{ color: Colors.text }}>Ajustes</Text>
    </View>
  );
}
