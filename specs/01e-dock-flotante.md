# Spec 01e: Dock flotante centrado

## Objetivo
Reemplazar la barra de tabs por el dock flotante del DESIGN.md: píldora blanca,
siempre centrada, con 5 tabs repartidas en partes iguales.

## Fuera de alcance
Contenido real de las pantallas. Las tabs conservan su placeholder.

## Verificación previa
- `npm ls @react-navigation/bottom-tabs`. Si no aparece, `npx expo install @react-navigation/bottom-tabs`.

## Pasos (hacer a mano)
1. En `src/theme/shadows.ts` agregar:
   export const dockShadow = {
     shadowColor: '#4A3E3D', shadowOpacity: 0.08, shadowRadius: 24,
     shadowOffset: { width: 0, height: 10 }, elevation: 8,
   };
2. En `src/theme/colors.ts` agregar: salmon: '#F4A896'
3. Crear `src/theme/layout.ts`:
   import { useSafeAreaInsets } from 'react-native-safe-area-context';
   export const DOCK_HEIGHT = 64;
   export const DOCK_GAP = 16;
   // Distancia desde el borde inferior de la pantalla hasta el borde superior del dock
   export function useDockClearance() {
     const insets = useSafeAreaInsets();
     return DOCK_HEIGHT + DOCK_GAP + insets.bottom;
   }

## Pasos (openCode)
4. Crear `src/components/FloatingTabBar.tsx`
   Props: BottomTabBarProps (import type desde '@react-navigation/bottom-tabs').
   Estructura:
   - Contenedor externo: View absolute, left 0, right 0, bottom = DOCK_GAP + insets.bottom,
     alignItems 'center', paddingHorizontal 16, pointerEvents 'box-none'.
   - Contenedor interno: width '100%', maxWidth 480, altura DOCK_HEIGHT,
     'bg-surface rounded-xl border border-primary/15', fila, style={dockShadow}.
   - Un Pressable por ruta con 'flex-1 items-center justify-center'.
   Por cada ruta:
   - focused = state.index === index
   - options = descriptors[route.key].options
   - Icono: options.tabBarIcon?.({ focused, color, size: 24 })
     con color = focused ? colors.primary : colors.taupe
   - Etiqueta: AppText variant 'label-sm', del options.title (o route.name),
     tone 'primary' si focused, 'taupe' si no.
   - Si focused, debajo un punto de 4x4 px, rounded-full, color colors.salmon.
   - onPress, con este manejo estándar:
       const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
       if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
   - accessibilityRole 'button' y accessibilityState={{ selected: focused }}.
   Teclado: si el teclado está visible, devolver null.
   (useState + Keyboard.addListener 'keyboardDidShow' / 'keyboardDidHide'; limpiar en el return del useEffect.)
5. En `app/(tabs)/_layout.tsx`:
   - Pasar a Tabs la prop: tabBar={(props) => <FloatingTabBar {...props} />}
   - Dejar screenOptions={{ headerShown: false }}.
   - Quitar tabBarStyle, tabBarActiveTintColor, tabBarLabelStyle y colores de la barra
     anterior. Mantener los Tabs.Screen (nombre, title y tabBarIcon) tal como están.
6. En `src/components/ui/Fab.tsx`: el valor por defecto de `bottom` pasa a
   useDockClearance() + 16.
7. En `app/(tabs)/index.tsx` (Agenda), TEMPORAL: reemplazar el contenido por un
   ScrollView con 12 Card de ejemplo (texto "Turno de ejemplo N") y un Fab.
   contentContainerStyle con paddingBottom = useDockClearance() + 24, y fondo background.

## Criterios de aceptación
- El dock está pegado abajo con 16 px de aire y los márgenes izquierdo y derecho son
  IGUALES (compará a ojo los dos lados).
- Las 5 tabs se reparten en partes iguales y todas muestran ícono y nombre completo.
- La tab activa se ve en rosa con un punto salmón debajo; las otras en taupe.
- Tocar cada tab cambia de pantalla.
- En Agenda, al desplazar la lista, el último ejemplo se ve completo por encima del dock
  y el botón flotante queda arriba del dock sin taparlo.
- Al enfocar un campo de texto (por ejemplo en la pantalla de componentes o con el teclado
  abierto) el dock desaparece.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`