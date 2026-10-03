# Spec 01: NativeWind y tema pastel

## Objetivo
Poder usar clases Tailwind (className) en toda la app, con la paleta del proyecto como tema.

## Fuera de alcance
Base de datos, componentes reutilizables, lógica de negocio.

## Pasos
1. Instalar dependencias de runtime:
   `npx expo install nativewind react-native-reanimated react-native-safe-area-context`
2. Instalar Tailwind v3 (NO v4):
   `npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss`
3. Generar config: `npx tailwindcss init`
4. Editar `tailwind.config.js`:
   - content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"]
   - presets: [require("nativewind/preset")]
   - colors: {
    background: '#FAF5F5',
    porcelain: '#FFFDFB',
    surface: '#FFFFFF',
    primary: { DEFAULT: '#E88D90', pressed: '#D9777A' },
    salmon: '#F4A896',
    peach: '#FBD6C6',
    ink: '#4A3E3D',
    taupe: '#7B6E6D',
    line: '#F0E4E4',
    divider: '#F6EAEA',
    success: { bg: '#E8F5EC', fg: '#2D6A4F' },
    warning: { bg: '#FEF3D6', fg: '#8F5D18' },
    danger:  { bg: '#FCEAEB', fg: '#A23E48' },
    
    // Áreas de servicio
    skincare: '#E88D90',
    makeup: '#F4A896',
    nails: '#FBD6C6',
},
5. Crear `global.css` en la raíz con:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
6. Crear `babel.config.js` en la raíz:
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
7. Ejecutar `npx expo customize metro.config.js` y dejarlo así:
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require("nativewind/metro");
   const config = getDefaultConfig(__dirname);
   module.exports = withNativeWind(config, { input: "./global.css" });
8. Agregar `import "../global.css";` arriba de todo en `app/_layout.tsx`.
   Crear `nativewind-env.d.ts` en la raíz con:
   /// <reference types="nativewind/types" />
9. (openCode) En las 4 pantallas de `app/(tabs)/`, reemplazar los estilos
   inline por className: contenedor "flex-1 items-center justify-center bg-background",
   texto "text-xl text-ink".
   Solo en Agenda, agregar temporalmente 3 badges redondeados con
   fondo skincare, makeup y nails, con textos "Cosmetología", "Maquillaje", "Uñas".
10. NO borrar `src/theme/colors.ts`: lo usa la barra de tabs (no acepta className).

## Criterios de aceptación
- La app abre sin pantalla roja tras `npx expo start -c`.
- Las 4 pantallas se ven igual que antes (fondo hueso, texto marrón).
- En Agenda se ven 3 badges con colores pastel distintos.
- `npx tsc --noEmit` sin errores (incluido el uso de className).

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`  (la -c limpia la caché, es obligatoria)