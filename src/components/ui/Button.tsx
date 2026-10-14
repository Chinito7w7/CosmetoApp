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
  size?: 'sm' | 'md';
  className?: string;
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

export function Button({ label, onPress, variant = 'primary', icon, disabled, fullWidth, size = 'md', className }: ButtonProps) {
  const variantClass = variants[variant];
  const textTone = textTones[variant] as 'ink' | 'taupe' | 'primary' | 'onPrimary';
  
  const sizeClasses = size === 'sm' 
    ? 'h-9 px-4' 
    : 'h-12 px-6';

  const textVariant = size === 'sm' ? 'label-md' : 'label-lg';

  return (
    <Pressable 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2 rounded-full ${sizeClasses} ${variantClass} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''} ${className || ''}`}
    >
      {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={textTone === 'onPrimary' ? '#FFFFFF' : '#4A3E3D'} />}
      <AppText variant={textVariant} tone={textTone}>{label}</AppText>
    </Pressable>
  );
}
