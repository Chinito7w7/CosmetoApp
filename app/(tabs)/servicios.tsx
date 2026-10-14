import React, { useState, useCallback } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { StatusChip } from '@/src/components/ui/StatusChip'; // Asumiendo que existe por el spec
import { CategoryHeader } from '@/src/components/services/CategoryHeader';
import { ServiceCard } from '@/src/components/services/ServiceCard';
import { listCategories, setCategoryActive } from '@/src/db/categories';
import { listServices, setServiceActive } from '@/src/db/services';
import { EmptyState } from '@/src/components/ui/EmptyState'; // Asumiendo que existe por el spec
import { useDockClearance } from '@/src/hooks/useDockClearance'; // Asumiendo que existe por el spec
import { FilterChip } from '@/src/components/ui/FilterChip'; // Asumiendo que existe por el spec
import { Ionicons } from '@expo/vector-icons';

export default function ServiciosScreen() {
  const db = useSQLiteContext();
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
      
      // Descartar servicios cuya categoría esté inactiva
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
        paddingTop: 60, // Approximation of inset + 16
        paddingBottom: dockClearance + 24 
      }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <AppText variant="headline-xl" tone="ink">Servicios y precios</AppText>
        <Button 
          label="Nuevo servicio" 
          icon="add" 
          size="sm" 
          onPress={() => Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.')} 
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
          onAction={() => Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.')}
        />
      ) : (
        <View>
          {selectedCategoryId === null ? (
            // Agrupar por categoría
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
                      onEdit={() => Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.')} 
                    />
                  ))}
                </View>
              );
            })
          ) : (
            // Filtrar por categoría seleccionada
            <View>
              {services.filter(s => s.category_id === selectedCategoryId).length === 0 ? (
                <EmptyState 
                  icon="leaf-outline"
                  title={`No hay servicios en ${categories.find(c => c.id === selectedCategoryId)?.name}`} 
                  description="Creá servicios para esta categoría para empezar a agendarlos."
                  actionLabel="Crear servicio"
                  onAction={() => Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.')}
                />
              ) : (

                services.filter(s => s.category_id === selectedCategoryId).map(svc => (
                  <ServiceCard 
                    key={svc.id} 
                    service={svc} 
                    onToggleActive={(next) => handleToggleActive(svc.id, next)} 
                    onEdit={() => Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.')} 
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
