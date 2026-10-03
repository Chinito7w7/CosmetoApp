# Spec 01d: Inputs, búsqueda, estado vacío, botón flotante y tarjeta de resumen

## Objetivo
Completar los componentes base que usan las pantallas de Agenda, Clientes y formularios.

## Fuera de alcance
Dock flotante (spec 01e), integración con react-hook-form, lógica de negocio.

## Pasos (hacer a mano)
1. En `src/theme/colors.ts` agregar: success: '#2D6A4F', warning: '#8F5D18'.
2. En `src/theme/shadows.ts` agregar:
   export const floatShadow = {
     shadowColor: '#4A3E3D', shadowOpacity: 0.16, shadowRadius: 20,
     shadowOffset: { width: 0, height: 10 }, elevation: 6,
   };

## Pasos (openCode, UN componente por vez, en `src/components/ui/`)
3. `TextField.tsx` (controlado, listo para usar con Controller de react-hook-form)
   Props: label?, value, onChangeText, onBlur?, placeholder?, error?, helper?,
   multiline?, keyboardType?, required?, autoCapitalize?.
   - Label arriba: AppText 'label-md' tone taupe (con " *" si required), mb-1.
   - Input: 'font-jakarta text-body-md text-ink bg-surface rounded px-3 border-[1.5px]'.
     Alto mínimo 48 (min-h-12); si multiline: min-h-24, texto arriba (textAlignVertical 'top').
   - Borde 'border-line'; con foco 'border-primary' (estado con useState);
     con error 'border-danger-fg'. placeholderTextColor '#7B6E6D'.
   - Debajo: si hay error, AppText 'body-sm' en rojo ('text-danger-fg'); si no, helper en taupe.
4. `SearchField.tsx`
   Props: value, onChangeText, placeholder.
   Píldora (rounded-full), alto 48, 'bg-surface border-[1.5px] border-line', icono
   'search-outline' a la izquierda (color #7B6E6D). Si hay texto, botón 'close-circle'
   a la derecha que limpia el campo.
5. `EmptyState.tsx`
   Props: icon (Ionicons), title, description, actionLabel?, onAction?.
   Centrado. Icono dentro de dos círculos concéntricos: exterior 96 px 'bg-primary/10',
   interior 68 px 'bg-primary/20', icono 32 px color primary. Título 'headline-sm',
   descripción 'body-md' taupe, centrada y con ancho máximo (max-w-xs).
   Si hay actionLabel y onAction, un Button primary debajo (mt-6).
6. `Fab.tsx`
   Props: onPress, icon (default 'add'), bottom (número, default 96), accessibilityLabel.
   Pressable 56x56, rounded-full, 'bg-primary active:bg-primary-pressed',
   position absolute, right 16, bottom según la prop. style={floatShadow}. Icono blanco.
7. `StatCard.tsx`
   Props: icon, label, value (string), caption?, tone ('primary' | 'success' | 'warning').
   Usa Card con padding p-3. Arriba un cuadrado de 28 px rounded-md con el icono:
   primary 'bg-primary/15' (icono colors.primary), success 'bg-success-bg' (colors.success),
   warning 'bg-warning-bg' (colors.warning). Después el value en 'headline-lg'
   (con caption al lado en 'body-sm' taupe) y el label en 'body-sm' taupe.
8. Reexportar los 5 en `src/components/ui/index.ts`.
9. En `app/componentes.tsx` agregar secciones: 3 TextField (normal, con error, multiline),
   un SearchField funcional, 2 EmptyState (con y sin botón), 3 StatCard en fila
   (uno por tono) y un Fab. Poner keyboardShouldPersistTaps="handled" en el ScrollView.

## Criterios de aceptación
- El TextField cambia el borde a rosa al enfocarlo y a rojo con error.
- El SearchField muestra la lupa y, al escribir, aparece la X que limpia el texto.
- El EmptyState se ve centrado con los dos círculos y su botón funciona.
- El Fab queda flotando abajo a la derecha, con sombra.
- Las 3 StatCard muestran icono tintado, número grande y etiqueta.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`