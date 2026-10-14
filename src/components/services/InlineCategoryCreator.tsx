import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/src/components/ui/AppText';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { COLOR_KEYS, categoryBg, ColorKey } from '@/src/theme/categoryColors';
import { createCategory } from '@/src/db/categories';
import { SQLiteDatabase } from 'expo-sqlite';

interface InlineCategoryCreatorProps {
  db: SQLiteDatabase;
  onCreated: (id: number) => void;
  onCancel: () => void;
}

export function InlineCategoryCreator({ db, onCreated, onCancel }: InlineCategoryCreatorProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<ColorKey>('sage');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    try {
      const id = await createCategory(db, { name, colorKey: color });
      onCreated(id);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Card className="mt-2 p-3">
      <TextField 
        label="Nombre de la categoría" 
        value={name} 
        onChangeText={setName} 
        error={error || undefined} 
        autoFocus
      />

      
      <View className="flex-row justify-center gap-3 mb-4">
        {COLOR_KEYS.map(key => (
        <Pressable
          key={key} 
          className={`w-9 h-9 rounded-full items-center justify-center ${categoryBg[key]} ${
            color === key ? 'border-2 border-ink' : ''
          }`}
          onPress={() => setColor(key)}
        >
          {color === key && <Ionicons name="checkmark" size={16} color="white" />}
        </Pressable>

        ))}
      </View>

      <View className="flex-row gap-2">
        <Button label="Cancelar" variant="outline" size="sm" onPress={onCancel} className="flex-1" />
        <Button label="Crear categoría" variant="primary" size="sm" onPress={handleCreate} className="flex-1" />
      </View>

    </Card>
  );
}
