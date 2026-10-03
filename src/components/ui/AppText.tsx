import { Text, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  variant?: 'headline-xl' | 'headline-lg' | 'headline-sm' | 'body-lg' | 'body-md' | 'body-sm' | 'label-lg' | 'label-md' | 'label-sm';
  tone?: 'ink' | 'taupe' | 'primary' | 'onPrimary';
  className?: string;
}

const variants = {
  'headline-xl': 'font-jakarta-bold text-headline-xl',
  'headline-lg': 'font-jakarta-semibold text-headline-lg',
  'headline-sm': 'font-jakarta-semibold text-headline-sm',
  'body-lg': 'font-jakarta text-body-lg',
  'body-md': 'font-jakarta text-body-md',
  'body-sm': 'font-jakarta text-body-sm',
  'label-lg': 'font-jakarta-semibold text-label-lg',
  'label-md': 'font-jakarta-semibold text-label-md',
  'label-sm': 'font-jakarta-semibold text-label-sm',
};

const tones = {
  ink: 'text-ink',
  taupe: 'text-taupe',
  primary: 'text-primary',
  onPrimary: 'text-on-primary',
};

export function AppText({ variant = 'body-md', tone = 'ink', className, children, ...props }: AppTextProps) {
  return (
    <Text 
      className={`${variants[variant]} ${tones[tone]} ${className || ''}`} 
      {...props}
    >
      {children}
    </Text>
  );
}
