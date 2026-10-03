# Spec 01c: Componentes base (texto, botón, tarjeta, avatar, chips)

## Objetivo
Crear los componentes reutilizables más simples, con las medidas del DESIGN.md,
y una pantalla temporal para verlos todos juntos.

## Fuera de alcance
Inputs, estado vacío, botón flotante, tab bar flotante (spec 01d).
Lógica de negocio. Ninguna pantalla real cambia.

## Pasos (hacer a mano)
1. En `tailwind.config.js`, dentro de theme.extend:
   - Agregar el color: 'on-primary': '#FFFFFF'
   - Agregar:
     borderRadius: { sm: '4px', DEFAULT: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px' },
2. Crear `src/theme/shadows.ts`:
   export const cardShadow = {
     shadowColor: '#4A3E3D', shadowOpacity: 0.06, shadowRadius: 12,
     shadowOffset: { width: 0, height: 4 }, elevation: 2,
   };

## Pasos (openCode, UN componente por vez, en `src/components/ui/`)
3. `AppText.tsx`
   Props: variant, tone, className?, children, ...props de Text.
   variant (default 'body-md') -> clases:
     'headline-xl': 'font-jakarta-bold text-headline-xl'
     'headline-lg': 'font-jakarta-semibold text-headline-lg'
     'headline-sm': 'font-jakarta-semibold text-headline-sm'
     'body-lg': 'font-jakarta text-body-lg'
     'body-md': 'font-jakarta text-body-md'
     'body-sm': 'font-jakarta text-body-sm'
     'label-lg': 'font-jakarta-semibold text-label-lg'
     'label-md': 'font-jakarta-semibold text-label-md'
     'label-sm': 'font-jakarta-semibold text-label-sm'
   tone (default 'ink') -> 'ink': 'text-ink', 'taupe': 'text-taupe',
     'primary': 'text-primary', 'onPrimary': 'text-on-primary'.
   Las clases van escritas completas en objetos (Tailwind no detecta clases armadas con strings).
4. `Button.tsx`
   Props: label, onPress, variant ('primary' | 'tonal' | 'outline', default 'primary'),
   icon? (nombre de Ionicons), disabled?, fullWidth?.
   Base: Pressable, alto 48 (h-12), px-6, rounded-full, fila centrada, gap-2.
   primary: 'bg-primary active:bg-primary-pressed', texto onPrimary.
   tonal: 'bg-peach/30', texto ink.
   outline: 'border border-primary bg-transparent', texto ink.
   disabled: opacidad 50 y sin onPress.
   El texto usa AppText variant 'label-lg'.
5. `Card.tsx`
   Props: children, className?, style?.
   'bg-surface rounded-lg p-4' + style={cardShadow}.
6. `Avatar.tsx`
   Props: name, size ('sm' | 'md' | 'lg', default 'md'), tone ('neutral' | 'skincare' | 'makeup' | 'nails').
   Muestra las iniciales (primera letra de las dos primeras palabras, en mayúscula).
   Círculo; tamaños 32 / 44 / 56 px. Fondo: neutral 'bg-peach', skincare 'bg-skincare',
   makeup 'bg-makeup', nails 'bg-nails'. Texto 'label-lg' tone ink.
7. `StatusChip.tsx`
   Props: label, variant ('success' | 'warning' | 'danger' | 'primary' | 'neutral'), dot?.
   Píldora 'rounded-full px-2.5 py-1'. Colores:
     success: 'bg-success-bg' + texto 'text-success-fg'
     warning: 'bg-warning-bg' + 'text-warning-fg'
     danger:  'bg-danger-bg'  + 'text-danger-fg'
     primary: 'bg-primary/15' + 'text-ink'
     neutral: 'bg-line' + 'text-taupe'
   Texto 'label-sm'. Si dot es true, punto de 6 px del mismo color que el texto.
8. `FilterChip.tsx`
   Props: label, active, onPress.
   Píldora de alto 36. Inactivo: 'bg-surface border border-line', texto ink.
   Activo: 'bg-primary border border-primary', texto onPrimary. Texto 'label-md'.
9. `src/components/ui/index.ts` que reexporte los 6 componentes.
10. Crear `app/componentes.tsx` (pantalla TEMPORAL) con ScrollView, fondo background y
    secciones: todas las variantes de AppText; 3 botones + 1 deshabilitado + 1 con icono
    (ej. 'calendar-outline'); una Card con texto; 4 Avatar (uno por tono, nombres
    distintos) y los 3 tamaños; un StatusChip de cada variante (uno con dot);
    3 FilterChip que alternan activo al tocarlos (useState).
11. En `app/(tabs)/ajustes.tsx`, agregar un botón tonal "Ver componentes (temporal)"
    que navegue a '/componentes' con Link o router.push.

## Criterios de aceptación
- `npx expo start -c` abre sin errores y Ajustes lleva a la pantalla de componentes.
- Botón primario rosa con texto blanco; al mantenerlo apretado se oscurece un poco.
- La Card tiene esquinas bien redondeadas (16 px) y una sombra suave.
- Los avatares muestran iniciales correctas y los 3 tamaños se distinguen.
- Cada chip de estado se ve con su color (verde, ámbar, rojo, rosa, gris).
- Los FilterChip cambian entre activo (relleno rosa) e inactivo al tocarlos.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`