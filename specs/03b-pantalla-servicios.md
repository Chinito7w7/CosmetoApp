# Spec 03b: Pantalla Servicios (lista, filtros, estados vacíos)

## Objetivo
Mostrar el catálogo agrupado por categoría, con filtros, activar/desactivar servicios
y estados vacíos. Sin formulario todavía.

## Fuera de alcance
Formulario de servicio y gestión de categorías (spec 03c). Los botones "Nuevo servicio"
y "Editar" solo muestran Alert.alert('Próximamente', 'El formulario se agrega en el spec 03c.').

## Pasos (openCode, UN archivo por vez)
1. `src/components/ui/Button.tsx`: agregar la prop size ('md' | 'sm', default 'md').
   'sm': altura 36 (h-9), px-4 y texto 'label-md'. 'md' queda igual que hoy.
2. `src/components/services/CategoryHeader.tsx`
   Props: name, colorKey (string), count (number).
   Fila: punto de 10 px (rounded-full) con el color de categoryBg[colorKey]
   (si colorKey no es válido, usar 'sand'; usar isColorKey), el nombre en mayúsculas
   con AppText 'label-md' taupe, y el contador a la derecha en 'label-sm' taupe.
3. `src/components/services/ServiceCard.tsx`
   Props: service (ServiceWithCategory), onToggleActive(next: boolean), onEdit().
   Usa Card (con className mb-3). Contenido:
   - Fila 1: nombre en 'headline-sm' (flex-1) y precio con formatARS en 'headline-sm' a la derecha.
   - Fila 2: ícono 'time-outline' (14 px, color taupe) + formatDuration en 'body-sm' taupe.
     Si el servicio está inactivo, a la derecha un StatusChip neutral "Inactivo".
   - Si hay descripción: AppText 'body-sm' taupe, máximo 2 líneas.
   - Separador fino (border-t border-divider, mt-3 pt-3).
   - Pie: a la izquierda un Switch de react-native con la etiqueta "Activo"
     (trackColor false '#DBCBCB' y true colors.primary, thumbColor '#FFFFFF');
     a la derecha un Button outline size 'sm' "Editar".
   Si el servicio está inactivo, todo el contenido de la tarjeta con opacidad 60.
4. En `app/db-debug.tsx`, dos botones temporales:
   - "Cargar servicios de prueba": si ya existen servicios cuyo nombre empieza con 'DEMO ', no hace nada.
     Si no, usa createService con las categorías existentes (buscar el id por nombre):
       Cosmetología: 'DEMO Limpieza facial profunda' 60 min $18000;
                     'DEMO Peeling renovador' 45 min $22000;
                     'DEMO Dermaplaning' 50 min $20000 (descripción 'Exfoliación con bisturí y sérum').
       Maquillaje:   'DEMO Maquillaje social' 60 min $25000;
                     'DEMO Maquillaje de novia' 120 min $60000 y luego setServiceActive(false).
       Uñas:         'DEMO Semipermanente' 90 min $12000.
   - "Borrar servicios de prueba": DELETE FROM services WHERE name LIKE 'DEMO %'.
5. `app/(tabs)/servicios.tsx` (reemplaza el placeholder)
   - Cargar datos con useFocusEffect (de expo-router) + useCallback: listCategories(db)
     y listServices(db, { includeInactive: true }). Descartar en JS los servicios cuya
     categoría esté inactiva (category_is_active = 0). Mientras carga la primera vez, no renderizar la lista.
   - Estado: selectedCategoryId (null = Todos).
   - Contenedor: ScrollView, fondo background, paddingTop = inset superior + 16,
     paddingHorizontal 16 y paddingBottom = useDockClearance() + 24.
   - Encabezado: fila con el título "Servicios y precios" (AppText 'headline-xl') a la izquierda y
     un Button size 'sm' con ícono 'add' y texto "Nuevo servicio" a la derecha. Debajo, un StatusChip
     variant 'primary' con "N servicios activos" ("1 servicio activo" en singular),
     contando solo los activos.
   - Filtros: ScrollView horizontal (sin indicador) con FilterChip "Todos" y uno por cada
     categoría activa (aunque no tenga servicios).
   - Lista: con "Todos", agrupar por categoría en el orden de listCategories; cada grupo con
     CategoryHeader (count = servicios del grupo) y sus ServiceCard. Con una categoría
     seleccionada, solo ese grupo. No mostrar grupos vacíos en "Todos".
   - onToggleActive: setServiceActive y recargar; si lanza error, Alert.alert('Error', mensaje).
   - Si no hay ningún servicio: EmptyState con ícono 'leaf-outline', título "Tu catálogo está vacío",
     descripción "Creá tus servicios con duración y precio para agendarlos rápido en tus turnos." y
     actionLabel "Crear primer servicio".
   - Si hay servicios pero el filtro no tiene ninguno: EmptyState con título
     "No hay servicios en {categoría}" y actionLabel "Crear servicio".
   - Las clases de color de categoría vienen de categoryBg (no armar clases con texto dinámico).

## Criterios de aceptación
- Sin servicios: aparece el estado vacío con su botón (que muestra el aviso "Próximamente").
- Después de "Cargar servicios de prueba": tres grupos (Cosmetología 3, Maquillaje 2, Uñas 1),
  cada uno con su puntito de color, y el contador dice "5 servicios activos".
- Precios y duraciones se ven bien: "$ 18.000", "1 h", "45 min", "2 h".
- El servicio "DEMO Maquillaje de novia" aparece atenuado con el chip "Inactivo".
- Los chips de filtro muestran Todos y las 4 categorías activas. Elegir "Otros" muestra el
  estado vacío del filtro; elegir "Uñas" muestra solo su servicio.
- Apagar el switch de un servicio lo atenúa, actualiza el contador y se mantiene al salir y
  volver a la pestaña y al cerrar la app. Volver a encenderlo lo restaura.
- La última tarjeta se ve completa por encima del dock.
- "Borrar servicios de prueba" devuelve el estado vacío.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`