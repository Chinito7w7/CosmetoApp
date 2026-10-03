import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export function TextField({ label, error, helper, required, className, ...props }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const borderColor = error 
    ? 'border-danger-fg' 
    : isFocused 
      ? 'border-primary' 
      : 'border-line';

  return (
    <View className="gap-1 mb-4">
      {label && (
        <AppText variant="label-md" tone="taupe">
          {label}{required ? ' *' : ''}
        </AppText>
      )}
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#7B6E6D"
        className={`font-jakarta text-body-md text-ink bg-surface rounded px-3 border-[1.5px] ${borderColor} ${
          props.multiline ? 'min-h-24 text-top' : 'min-h-12'
        } ${className || ''}`}
        style={props.multiline ? { textAlignVertical: 'top' } : {}}
        {...props}
      />
      {error ? (
        <AppText variant="body-sm" className="text-danger-fg">{error}</AppText>
      ) : helper ? (
        <AppText variant="body-sm" tone="taupe">{helper}</AppText>
      ) : null}
    </View>
  );
}
