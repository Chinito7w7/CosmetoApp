import { View, ViewProps } from 'react-native';
import { cardShadow } from '@/src/theme/shadows';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, style, ...props }: CardProps) {
  return (
    <View 
      style={[cardShadow, style]} 
      className={`bg-surface rounded-lg p-4 ${className || ''}`} 
      {...props}
    >
      {children}
    </View>
  );
}
