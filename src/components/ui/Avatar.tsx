import { View, Text } from 'react-native';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'skincare' | 'makeup' | 'nails';
}

const sizes = {
  sm: 'w-8 h-8 text-label-sm',
  md: 'w-11 h-11 text-label-lg',
  lg: 'w-14 h-14 text-headline-sm',
};

const tones = {
  neutral: 'bg-peach',
  skincare: 'bg-skincare',
  makeup: 'bg-makeup',
  nails: 'bg-nails',
};

export function Avatar({ name, size = 'md', tone = 'neutral' }: AvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join('');

  return (
    <View className={`rounded-full items-center justify-center ${sizes[size]} ${tones[tone]}`}>
      <Text className="text-ink font-jakarta-semibold">{initials}</Text>
    </View>
  );
}
