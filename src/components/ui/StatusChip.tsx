import { View } from 'react-native';
import { AppText } from './AppText';

interface StatusChipProps {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'primary' | 'neutral';
  dot?: boolean;
}

const variants = {
  success: { bg: 'bg-success-bg', fg: 'text-success-fg', dot: '#2D6A4F' },
  warning: { bg: 'bg-warning-bg', fg: 'text-warning-fg', dot: '#8F5D18' },
  danger: { bg: 'bg-danger-bg', fg: 'text-danger-fg', dot: '#A23E48' },
  primary: { bg: 'bg-primary/15', fg: 'text-ink', dot: '#E88D90' },
  neutral: { bg: 'bg-line', fg: 'text-taupe', dot: '#7B6E6D' },
};

export function StatusChip({ label, variant, dot }: StatusChipProps) {
  const config = variants[variant];
  
  return (
    <View className={`rounded-full px-2.5 py-1 flex-row items-center gap-1 ${config.bg}`}>
      {dot && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: config.dot }} />}
      <AppText variant="label-sm" tone={variant === 'primary' ? 'ink' : 'taupe'} className={config.fg}>
        {label}
      </AppText>
    </View>
  );
}
