import React, { useEffect, useState } from 'react';
import { ScrollView, View, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { TextField } from '@/src/components/ui/TextField';
import { Card } from '@/src/components/ui/Card';
import { FilterChip } from '@/src/components/ui/FilterChip';
import { Switch } from 'react-native';
import { listCategories } from '@/src/db/categories';
import { getService, createService, updateService, setServiceActive } from '@/src/db/services';
import { serviceFormSchema, serviceFormDefaults, toServiceInput, serviceFormResolver, ServiceFormValues } from '@/src/forms/serviceForm';
import { InlineCategoryCreator } from '@/src/components/services/InlineCategoryCreator';
import { formatARS, formatDuration } from '@/src/lib/format';

export default function ServicioFormScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id, categoryId: preselectedCatId } = useLocalSearchParams<{ id?: string, categoryId?: string }>();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [showCatCreator, setShowCatCreator] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, watch, reset, formState: { isDirty } } = useForm<ServiceFormValues>({
    resolver: serviceFormResolver as any,
    defaultValues: serviceFormDefaults as any,
  });



  const currentValues = watch();

  useEffect(() => {
    const init = async () => {
      const cats = await listCategories(db);
      setCategories(cats);

      if (id) {
        const service = await getService(db, Number(id));
        if (service) {
          const cat = cats.find(c => c.id === service.category_id);
          const isCatActive = cat?.is_active === 1;
          
          reset({
            categoryId: isCatActive ? service.category_id : null,
            name: service.name,
            description: service.description || '',
            duration: String(service.duration_min),
            price: String(service.base_price),
            isActive: service.is_active === 1,
          });
        }
      } else if (preselectedCatId) {
        setValue('categoryId', Number(preselectedCatId));
      }
    };
    init();
  }, [db, id, preselectedCatId]);

  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
    try {
      const input = toServiceInput(data);
      let serviceId: number;
      
      if (id) {
        serviceId = Number(id);
        await updateService(db, serviceId, input);
      } else {
        serviceId = await createService(db, input);
      }
      
      await setServiceActive(db, serviceId, data.isActive);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };


  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        '¿Descartar cambios?', 
        'Los cambios realizados no se guardarán.', 
        [
          { text: 'Seguir editando', style: 'cancel' },
          { text: 'Descartar', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 border-b border-line bg-white">
        <Pressable onPress={handleCancel} className="p-2">
          <Ionicons name="close" size={24} color="#4A3E3D" />
        </Pressable>
        <AppText variant="headline-sm" tone="ink" className="flex-1 text-center mr-10">
          {id ? 'Editar servicio' : 'Nuevo servicio'}
        </AppText>
      </View>

      <ScrollView 
        className="flex-1 p-4" 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-6">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField 
                label="Nombre del servicio" 
                required 
                value={field.value} 
                onChangeText={field.onChange} 
                error={fieldState.error?.message} 
              />
            )}
          />

          <View className="gap-2">
            <AppText variant="label-md" tone="taupe">Categoría *</AppText>
            <View className="flex-row flex-wrap gap-2">
              {categories.map(cat => (
                <FilterChip 
                  key={cat.id} 
                  label={cat.name} 
                  active={currentValues.categoryId === cat.id} 
                  onPress={() => setValue('categoryId', cat.id)} 
                />
              ))}
              <FilterChip 
                label="+ Nueva categoría" 
                active={false} 
                onPress={() => {
                  setCatError(null);
                  setShowCatCreator(true);
                }} 
              />
            </View>
            <Controller
              control={control}
              name="categoryId"
              render={({ fieldState }) => (
                <AppText variant="body-sm" className="text-danger-fg">
                  {fieldState.error?.message}
                </AppText>
              )}
            />
          </View>

          {showCatCreator && (
            <InlineCategoryCreator 
              db={db} 
              onCreated={(newId) => {
                setValue('categoryId', newId);
                setShowCatCreator(false);
                listCategories(db).then(setCategories);
              }} 
              onCancel={() => setShowCatCreator(false)} 
            />
          )}

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <TextField 
                label="Descripción" 
                multiline 
                helper="Se muestra al elegir el servicio en un turno" 
                value={field.value} 
                onChangeText={field.onChange} 
                error={fieldState.error?.message} 
              />
            )}
          />

          <View className="gap-3">
            <Controller
              control={control}
              name="duration"
              render={({ field, fieldState }) => (
                <TextField 
                  label="Duración en minutos" 
                  required 
                  keyboardType="numeric" 
                  value={field.value} 
                  onChangeText={(text) => field.onChange(text.replace(/\D/g, ''))} 
                  error={fieldState.error?.message} 
                />
              )}
            />
            <View className="flex-row flex-wrap gap-2">
              {[15, 30, 45, 60, 90].map(min => (
                <FilterChip 
                  key={min} 
                  label={`${min} min`} 
                  active={currentValues.duration === String(min)} 
                  onPress={() => setValue('duration', String(min))} 
                />
              ))}
            </View>
            {currentValues.duration && !isNaN(Number(currentValues.duration)) && (
              <AppText variant="body-sm" tone="taupe" className="italic">
                Duración estimada: {formatDuration(Number(currentValues.duration))}
              </AppText>
            )}
          </View>

          <View className="gap-2">
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <TextField 
                  label="Precio base (ARS)" 
                  required 
                  keyboardType="numeric" 
                  value={field.value} 
                  onChangeText={(text) => field.onChange(text.replace(/\D/g, ''))} 
                  error={fieldState.error?.message} 
                />
              )}
            />
            {currentValues.price && !isNaN(Number(currentValues.price)) && (
              <AppText variant="body-sm" tone="taupe" className="italic">
                Precio formateado: {formatARS(Number(currentValues.price))}
              </AppText>
            )}
          </View>

          <Card className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Switch 
                value={currentValues.isActive} 
                onValueChange={(val) => setValue('isActive', val)} 
                trackColor={{ false: '#DBCBCB', true: '#E88D90' }} 
                thumbColor="#FFFFFF" 
              />
              <AppText variant="body-md" tone="ink">Servicio activo</AppText>
            </View>
          </Card>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-line flex-row gap-2">
        <Button label="Cancelar" variant="outline" onPress={handleCancel} className="flex-1" />
        <Button label="Guardar servicio" variant="primary" onPress={handleSubmit(onSubmit)} className="flex-1" />
      </View>
    </View>
  );
}
