import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  return (
    <View className="flex-row items-center bg-surface border-[1.5px] border-line rounded-full px-4 h-12 gap-2">
      <Ionicons name="search-outline" size={20} color="#7B6E6D" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7B6E6D"
        className="flex-1 font-jakarta text-body-md text-ink"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#7B6E6D" />
        </Pressable>
      )}
    </View>
  );
}
