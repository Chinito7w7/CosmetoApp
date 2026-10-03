import { Pressable, View } from 'react-native';
import { AppText } from './AppText';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable 
      onPress={onPress}
      className={`h-9 px-3 rounded-full border ${
        active 
          ? 'bg-primary border-primary' 
          : 'bg-surface border-line'
      }`}
    >
      <AppText 
        variant="label-md" 
        tone={active ? 'onPrimary' : 'ink'}
        className="text-center"
      >
        {label}
      </AppText>
    </Pressable>
  );
}
