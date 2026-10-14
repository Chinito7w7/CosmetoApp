import { View } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { categoryBg, isColorKey, ColorKey } from '@/src/theme/categoryColors';

interface CategoryHeaderProps {
  name: string;
  colorKey: string;
  count: number;
}

export function CategoryHeader({ name, colorKey, count }: CategoryHeaderProps) {
  const validColorKey = isColorKey(colorKey) ? colorKey : 'sand';
  const bgColor = categoryBg[validColorKey as ColorKey];

  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2">
        <View className={`w-2.5 h-2.5 rounded-full ${bgColor}`} />
        <AppText variant="label-md" tone="taupe" className="uppercase">
          {name}
        </AppText>
      </View>
      <AppText variant="label-sm" tone="taupe">
        {count}
      </AppText>
    </View>
  );
}
