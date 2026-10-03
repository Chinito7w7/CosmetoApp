import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { 
  AppText, Button, Card, Avatar, StatusChip, FilterChip, 
  TextField, SearchField, EmptyState, Fab, StatCard 
} from '@/src/components/ui';

export default function ComponentesScreen() {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    one: true,
    two: false,
    three: false,
  });

  const toggleFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView 
      className="flex-1 bg-background p-6" 
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-8 py-10">
        
        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Tipografía</AppText>
          <AppText variant="headline-xl" tone="ink">Headline XL</AppText>
          <AppText variant="headline-lg" tone="ink">Headline LG</AppText>
          <AppText variant="headline-sm" tone="ink">Headline SM</AppText>
          <AppText variant="body-lg" tone="ink">Body LG</AppText>
          <AppText variant="body-md" tone="ink">Body MD</AppText>
          <AppText variant="body-sm" tone="ink">Body SM</AppText>
          <AppText variant="label-lg" tone="ink">Label LG</AppText>
          <AppText variant="label-md" tone="ink">Label MD</AppText>
          <AppText variant="label-sm" tone="ink">Label SM</AppText>
          <AppText variant="body-md" tone="taupe">Texto en Taupe</AppText>
          <AppText variant="body-md" tone="primary">Texto en Primario</AppText>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Inputs y Búsqueda</AppText>
          <View className="gap-4">
            <SearchField 
              value={search} 
              onChangeText={setSearch} 
              placeholder="Buscar cliente..." 
            />
            <TextField 
              label="Nombre completo" 
              placeholder="Ej. Maria Lopez" 
              required 
            />
            <TextField 
              label="Observaciones" 
              placeholder="Detalles adicionales..." 
              multiline 
            />
            <TextField 
              label="Email" 
              error="Email inválido" 
              placeholder="email@ejemplo.com" 
            />
          </View>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Estados Vacíos</AppText>
          <View className="gap-8">
            <EmptyState 
              icon="calendar-outline" 
              title="No hay turnos hoy" 
              description="Tómate un descanso o comienza a agendar nuevos turnos." 
            />
            <EmptyState 
              icon="people-outline" 
              title="Sin clientes" 
              description="Aún no tienes clientes registrados." 
              actionLabel="Agregar Cliente" 
              onAction={() => {}} 
            />
          </View>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Métricas</AppText>
          <View className="flex-row gap-3">
            <StatCard 
              icon="cash-outline" 
              label="Ingresos" 
              value="$150k" 
              caption="Este mes" 
              tone="success" 
            />
            <StatCard 
              icon="time-outline" 
              label="Horas" 
              value="120h" 
              caption="Trabajadas" 
              tone="primary" 
            />
            <StatCard 
              icon="alert-circle-outline" 
              label="Pendientes" 
              value="5" 
              caption="Turnos" 
              tone="warning" 
            />
          </View>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Botones y Chips</AppText>
          <View className="gap-3">
            <Button label="Primario" onPress={() => {}} variant="primary" />
            <Button label="Tonal" onPress={() => {}} variant="tonal" />
            <Button label="Outline" onPress={() => {}} variant="outline" />
            <Button label="Deshabilitado" onPress={() => {}} disabled />
            <Button label="Con Icono" onPress={() => {}} icon="calendar-outline" />
            <Button label="Ancho Completo" onPress={() => {}} fullWidth />
          </View>
          <View className="flex-row gap-2 mt-4">
            <FilterChip label="Todo" active={activeFilters.one} onPress={() => toggleFilter('one')} />
            <FilterChip label="Activos" active={activeFilters.two} onPress={() => toggleFilter('two')} />
            <FilterChip label="Vencidos" active={activeFilters.three} onPress={() => toggleFilter('three')} />
          </View>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Avatares</AppText>
          <View className="flex-row gap-4 items-center">
            <Avatar name="Milagros Estética" tone="neutral" size="sm" />
            <Avatar name="Ana Perez" tone="skincare" size="md" />
            <Avatar name="Maria Lopez" tone="makeup" size="lg" />
            <Avatar name="Lucia Gomez" tone="nails" size="md" />
          </View>
        </View>

        <View className="gap-3">
          <AppText variant="headline-lg" tone="ink">Chips de Estado</AppText>
          <View className="flex-row flex-wrap gap-2">
            <StatusChip label="Completado" variant="success" />
            <StatusChip label="Pendiente" variant="warning" dot />
            <StatusChip label="Cancelado" variant="danger" />
            <StatusChip label="Especial" variant="primary" />
            <StatusChip label="Neutral" variant="neutral" />
          </View>
        </View>

        <Fab icon="add" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}
