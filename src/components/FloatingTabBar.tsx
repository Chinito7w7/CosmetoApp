import React, { useEffect, useState } from 'react';
import { View, Pressable, Keyboard } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppText } from './ui/AppText';
import { Colors } from '@/src/theme/colors';
import { dockShadow } from '@/src/theme/shadows';
import { DOCK_HEIGHT, DOCK_GAP } from '@/src/theme/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FloatingTabBar(props: any) {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  return (
    <View 
      style={{ position: 'absolute', bottom: DOCK_GAP + insets.bottom }}
      className="left-0 right-0 items-center px-4"
      pointerEvents="box-none"
    >
      <View 
        style={[dockShadow, { height: DOCK_HEIGHT }]}
        className="w-full max-w-[480px] bg-surface rounded-xl border border-primary/15 flex-row items-center"
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const color = isFocused ? Colors.primary : '#7B6E6D';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              className="flex-1 items-center justify-center"
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color, size: 24 })}
              <AppText 
                variant="label-sm" 
                tone={isFocused ? 'primary' : 'taupe'}
                className="mt-1"
              >
                {options.title || route.name}
              </AppText>
              {isFocused && (
                <View 
                  style={{ backgroundColor: Colors.salmon }} 
                  className="w-1 h-1 rounded-full mt-0.5" 
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
