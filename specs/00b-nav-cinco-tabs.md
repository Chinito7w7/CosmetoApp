# Spec 00b: Quinta tab (Ganancias) y orden final del nav

## Objetivo
Dejar el nav con 5 tabs en este orden: Agenda, Clientes, Servicios, Ganancias, Ajustes.

## Fuera de alcance
Estilo flotante del tab bar (spec 01c) y lógica de ganancias.

## Pasos
1. Crear `app/(tabs)/ganancias.tsx` con el mismo placeholder que las otras
   pantallas: texto "Ganancias" con className "font-jakarta-bold text-headline-xl text-ink",
   contenedor "flex-1 items-center justify-center bg-background".
2. Crear `src/config.ts` exportando: export const PROFESSIONAL_NAME = 'Milagros';
3. En `app/(tabs)/_layout.tsx`, declarar los Tabs.Screen en este orden exacto,
   con título e ícono Ionicons (versión outline):
   - index: "Agenda", calendar-outline
   - clientes: "Clientes", people-outline
   - servicios: "Servicios", leaf-outline
   - ganancias: "Ganancias", stats-chart-outline
   - ajustes: "Ajustes", settings-outline
4. No cambiar colores ni fuentes del tab bar (ya están definidos).

## Criterios de aceptación
- Se ven 5 tabs en el orden indicado, TODAS con ícono (incluida Agenda).
- Las 5 etiquetas se leen completas, sin cortarse, en tu celular.
- La tab activa se ve en rosa y la inactiva en gris taupe.
- Al tocar Ganancias se muestra su pantalla placeholder.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`