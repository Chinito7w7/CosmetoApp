import { View } from 'react-native';
import { Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { formatARS, formatDuration } from '@/src/lib/format';
import { ServiceWithCategory } from '@/src/db/types';
import { Colors } from '@/src/theme/colors';

interface ServiceCardProps {
  service: ServiceWithCategory;
  onToggleActive: (next: boolean) => void;
  onEdit: () => void;
}

export function ServiceCard({ service, onToggleActive, onEdit }: ServiceCardProps) {
  const isActive = service.is_active === 1;
  
  return (
    <Card className="mb-3" style={{ opacity: isActive ? 1 : 0.6 }}>
      <View className="flex-row justify-between items-start mb-1">
        <AppText variant="headline-sm" className="flex-1" tone="ink">
          {service.name}
        </AppText>
        <AppText variant="headline-sm" tone="ink">
          {formatARS(service.base_price)}
        </AppText>
      </View>

      <View className="flex-row items-center gap-1 mb-2">
        <Ionicons name="time-outline" size={14} color="#4A3E3D" />
        <AppText variant="body-sm" tone="taupe">
          {formatDuration(service.duration_min)}
        </AppText>
        {!isActive && (
          <View className="ml-auto bg-surface border border-line px-2 py-0.5 rounded">
            <AppText variant="label-sm" tone="taupe">Inactivo</AppText>
          </View>
        )}
      </View>

      {service.description && (
        <AppText variant="body-sm" tone="taupe" numberOfLines={2} className="mb-3">
          {service.description}
        </AppText>
      )}

      <View className="border-t border-divider mt-3 pt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Switch 
            value={isActive}
            onValueChange={onToggleActive}
            trackColor={{ false: '#DBCBCB', true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
          <AppText variant="body-sm" tone="taupe">Activo</AppText>
        </View>
        <Button 
          label="Editar" 
          variant="outline" 
          size="sm" 
          onPress={onEdit} 
        />
      </View>
    </Card>
  );
}
