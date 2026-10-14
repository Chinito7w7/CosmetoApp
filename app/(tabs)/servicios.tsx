import React, { useState, useCallback } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { StatusChip } from '@/src/components/ui/StatusChip';
import { CategoryHeader } from '@/src/components/services/CategoryHeader';
import { ServiceCard } from '@/src/components/services/ServiceCard';
import { listCategories } from '@/src/db/categories';
import { listServices, setServiceActive } from '@/src/db/services';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { useDockClearance } from '@/src/hooks/useDockClearance';
import { FilterChip } from '@/src/components/ui/FilterChip';

export default function ServiciosScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const dockClearance = useDockClearance();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const cats = await listCategories(db);
      const svcs = await listServices(db, { includeInactive: true });
      
      const activeCatIds = new Set(cats.map(c => c.id));
      const filteredSvcs = svcs.filter(s => activeCatIds.has(s.category_id));
      
      setCategories(cats);
      setServices(filteredSvcs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleToggleActive = async (serviceId: number, next: boolean) => {
    try {
      await setServiceActive(db, serviceId, next);
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const activeServicesCount = services.filter(s => s.is_active === 1).length;

  if (isLoading) return null;

  return (
    <ScrollView 
      className="flex-1 bg-background px-4"
      contentContainerStyle={{ 
        paddingTop: 60,
        paddingBottom: dockClearance + 24 
      }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <AppText variant="headline-xl" tone="ink">Servicios y precios</AppText>
        <Button 
          label="Nuevo servicio" 
          icon="add" 
          size="sm" 
          onPress={() => router.push('/servicio-form')} 
        />
      </View>

      <StatusChip 
        variant="primary" 
        label={`${activeServicesCount} ${activeServicesCount === 1 ? 'servicio activo' : 'servicios activos'}`} 
      />
      <View className="mb-6" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mb-6">
        <FilterChip 
          label="Todos" 
          active={selectedCategoryId === null} 
          onPress={() => setSelectedCategoryId(null)} 
        />
        {categories.map(cat => (
          <FilterChip 
            key={cat.id} 
            label={cat.name} 
            active={selectedCategoryId === cat.id} 
            onPress={() => setSelectedCategoryId(cat.id)} 
          />
        ))}
      </ScrollView>

      {services.length === 0 ? (
        <EmptyState 
          icon="leaf-outline" 
          title="Tu catálogo está vacío" 
          description="Creá tus servicios con duración y precio para agendarlos rápido en tus turnos." 
          actionLabel="Crear primer servicio"
          onAction={() => router.push('/servicio-form')}
        />
      ) : (
        <View>
          {selectedCategoryId === null ? (
            categories.map(cat => {
              const groupServices = services.filter(s => s.category_id === cat.id);
              if (groupServices.length === 0) return null;

              return (
                <View key={cat.id} className="mb-6">
                  <CategoryHeader 
                    name={cat.name} 
                    colorKey={cat.color_key} 
                    count={groupServices.length} 
                  />
                  {groupServices.map(svc => (
                    <ServiceCard 
                      key={svc.id} 
                      service={svc} 
                      onToggleActive={(next) => handleToggleActive(svc.id, next)} 
                      onEdit={() => router.push({ pathname: '/servicio-form', params: { id: svc.id } })} 
                    />
                  ))}
                </View>
              );
            })
          ) : (
            <View>
              {services.filter(s => s.category_id === selectedCategoryId).length === 0 ? (
                <EmptyState 
                  icon="leaf-outline"
                  title={`No hay servicios en ${categories.find(c => c.id === selectedCategoryId)?.name}`} 
                  description="Creá servicios para esta categoría para empezar a agendarlos."
                  actionLabel="Crear servicio"
                  onAction={() => router.push({ pathname: '/servicio-form', params: { categoryId: String(selectedCategoryId) } })}
                />
              ) : (
                services.filter(s => s.category_id === selectedCategoryId).map(svc => (
                  <ServiceCard 
                    key={svc.id} 
                    service={svc} 
                    onToggleActive={(next) => handleToggleActive(svc.id, next)} 
                    onEdit={() => router.push({ pathname: '/servicio-form', params: { id: svc.id } })} 
                  />
                ))
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
