# Spec 00: Esqueleto del proyecto y navegación por tabs

## Objetivo
Proyecto Expo funcionando con 4 tabs inferiores vacías: Agenda, Clientes, Servicios, Ajustes.

## Fuera de alcance
NativeWind, base de datos, formularios, cualquier lógica de negocio.

## Pasos
1. Crear el proyecto: `npx create-expo-app@latest escorpio-app` (template por defecto, TypeScript + Expo Router).
2. Dentro de `escorpio-app/`, ejecutar `npm run reset-project` y elegir borrar los ejemplos.
3. Crear `src/theme/colors.ts` exportando: background '#FAF5F5', primary '#E88D90', text '#4A3E3D'.
4. Crear `app/(tabs)/_layout.tsx` con el componente `Tabs` de expo-router:
   - 4 tabs en este orden: index (título "Agenda"), clientes ("Clientes"), servicios ("Servicios"), ajustes ("Ajustes").
   - Color de tab activa: primary. Fondo de la barra: background.
   - Íconos de Ionicons (@expo/vector-icons): calendar-outline, people-outline, pricetags-outline, settings-outline.
   - Header oculto o con el mismo fondo (decisión del implementador, pero consistente).
5. Crear 4 pantallas en `app/(tabs)/`: `index.tsx`, `clientes.tsx`, `servicios.tsx`, `ajustes.tsx`.
   Cada una muestra solo un texto centrado con su nombre. Fondo background, texto text.
6. Ajustar `app/_layout.tsx` para que renderice el grupo (tabs) sin pantallas extra.
7. Borrar archivos sobrantes que ya no se usen.

## Criterios de aceptación
- La app abre en Expo Go sin errores en pantalla roja.
- Se ven 4 tabs abajo, con ícono y nombre correctos.
- Al tocar cada tab cambia la pantalla.
- La tab activa se ve en rosa (#E88D90).

## Comandos de verificación
- `npx tsc --noEmit` (sin errores)
- `npx expo start` y abrir en el celular o emulador