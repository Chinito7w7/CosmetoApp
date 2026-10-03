# Spec 01b: Tipografía Plus Jakarta Sans

## Objetivo
Cargar Plus Jakarta Sans (400, 600, 700) y exponer la escala tipográfica
del DESIGN.md como clases Tailwind.

## Fuera de alcance
Componente AppText, botones, cards, inputs (eso es el spec 01c).

## Pasos
1. Instalar:
   `npx expo install @expo-google-fonts/plus-jakarta-sans expo-font expo-splash-screen`
2. Crear `src/theme/fonts.ts`:
   export const fonts = {
     regular: 'PlusJakartaSans_400Regular',
     semibold: 'PlusJakartaSans_600SemiBold',
     bold: 'PlusJakartaSans_700Bold',
   } as const;
3. En `tailwind.config.js`, dentro de theme.extend, agregar:
   fontFamily: {
     jakarta: ['PlusJakartaSans_400Regular'],
     'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
     'jakarta-bold': ['PlusJakartaSans_700Bold'],
   },
   fontSize: {
     'headline-xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.56px' }],
     'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.36px' }],
     'headline-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.18px' }],
     'body-lg':     ['16px', { lineHeight: '24px' }],
     'body-md':     ['14px', { lineHeight: '22px' }],
     'body-sm':     ['12px', { lineHeight: '18px' }],
     'label-lg':    ['14px', { lineHeight: '20px', letterSpacing: '0.14px' }],
     'label-md':    ['12px', { lineHeight: '16px', letterSpacing: '0.24px' }],
     'label-sm':    ['11px', { lineHeight: '14px', letterSpacing: '0.44px' }],
   },
4. En `app/_layout.tsx` (conservar lo que ya renderiza el layout), agregar:
   - import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold,
       PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
   - import * as SplashScreen from 'expo-splash-screen';
   - A nivel de módulo: SplashScreen.preventAutoHideAsync();
   - Dentro del componente:
       const [loaded, error] = useFonts({
         PlusJakartaSans_400Regular,
         PlusJakartaSans_600SemiBold,
         PlusJakartaSans_700Bold,
       });
       useEffect(() => { if (loaded || error) SplashScreen.hideAsync(); }, [loaded, error]);
       if (!loaded && !error) return null;
5. En `app/(tabs)/_layout.tsx`, agregar a screenOptions:
   tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 }
6. En las 4 pantallas de `app/(tabs)/`, el texto principal pasa a
   "font-jakarta-bold text-headline-xl text-ink".
7. Solo en Agenda, debajo de los badges de prueba, agregar 3 textos temporales:
   - "Headline" con "font-jakarta-bold text-headline-lg text-ink"
   - "Texto de cuerpo de prueba" con "font-jakarta text-body-md text-taupe"
   - "ETIQUETA" con "font-jakarta-semibold text-label-sm text-taupe"

## Criterios de aceptación
- La app abre sin pantalla roja ni warning de "fontFamily ... has not been loaded".
- Los textos se ven en Plus Jakarta Sans (letras más geométricas que la fuente por defecto).
- Los 3 textos de prueba en Agenda se ven con tamaños y pesos claramente distintos.
- Los nombres de las tabs de abajo también usan la nueva fuente.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`