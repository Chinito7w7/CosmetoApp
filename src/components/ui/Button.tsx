import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'tonal' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary active:bg-primary-pressed',
  tonal: 'bg-peach/30',
  outline: 'border border-primary bg-transparent',
};

const textTones = {
  primary: 'onPrimary',
  tonal: 'ink',
  outline: 'ink',
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, fullWidth }: ButtonProps) {
  const variantClass = variants[variant];
  const textTone = textTones[variant] as 'ink' | 'taupe' | 'primary' | 'onPrimary';

  return (
    <Pressable 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2 h-12 px-6 rounded-full ${variantClass} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''}`}
    >
      {icon && <Ionicons name={icon} size={20} color={textTone === 'onPrimary' ? '#FFFFFF' : '#4A3E3D'} />}
      <AppText variant="label-lg" tone={textTone}>{label}</AppText>
    </Pressable>
  );
}
