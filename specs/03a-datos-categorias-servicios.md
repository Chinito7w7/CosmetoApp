# Spec 03a: Datos de categorías y servicios

## Objetivo
Crear la capa de datos (funciones que reciben `db`) para categorías y servicios, con
validación en español, y probarla desde la pantalla de debug.

## Fuera de alcance
Pantallas y formularios (03b y 03c). Esquema: NO se toca, no hay migración nueva.

## Pasos (hacer a mano)
1. `npm install zod`
2. En `tailwind.config.js`, theme.extend.colors, agregar:
   sand: '#EADCD3', sage: '#CFE3D4', lilac: '#E4D8EE'
3. Agregar a `AGENTS.md`: "Datos: un módulo por tema en src/db/<nombre>.ts, funciones que
   reciben db, entradas validadas con zod. Las pantallas no escriben SQL."

## Pasos (openCode, UN archivo por vez)
4. `src/theme/categoryColors.ts`
   - export const COLOR_KEYS = ['rose','salmon','peach','sand','sage','lilac'] as const;
   - export type ColorKey = (typeof COLOR_KEYS)[number];
   - export const categoryBg: Record<ColorKey, string> =
       { rose:'bg-skincare', salmon:'bg-makeup', peach:'bg-nails', sand:'bg-sand', sage:'bg-sage', lilac:'bg-lilac' }
     (clases escritas completas, no armadas)
   - export const categoryHex: Record<ColorKey, string> =
       { rose:'#E88D90', salmon:'#F4A896', peach:'#FBD6C6', sand:'#EADCD3', sage:'#CFE3D4', lilac:'#E4D8EE' }
   - export function isColorKey(v: string): v is ColorKey
5. `src/lib/format.ts` (funciones puras, sin Intl)
   - formatARS(n: number): string  ->  18000 = '$ 18.000'; 1234567 = '$ 1.234.567'
     (separador de miles con punto, prefijo '$ ')
   - formatDuration(min: number): string  ->  45 = '45 min'; 60 = '1 h'; 90 = '1 h 30 min'
6. `src/lib/validation.ts`
   - parseOrThrow(schema, data): usa schema.safeParse; si falla, lanza
     new Error(primer mensaje de error); si no, devuelve los datos validados.
7. `src/db/categories.ts`
   Tipos: CategoryWithCount = CategoryRow & { service_count: number } (servicios ACTIVOS).
   Esquema zod: name (trim, min 1 'Ingresá un nombre', max 30 'Máximo 30 caracteres'),
   colorKey (z.enum(COLOR_KEYS)).
   Helper interno normalizeName(s): trim, colapsar espacios, minúsculas y quitar tildes
   (normalize('NFD') y borrar /[\u0300-\u036f]/g).
   Funciones:
   - listCategories(db, includeInactive = false): CategoryWithCount[]
       ordenadas por sort_order y luego name; solo activas salvo includeInactive.
       service_count = servicios activos de esa categoría.
   - createCategory(db, input): number (id)
       valida; si existe otra con el mismo nombre normalizado lanza
       'Ya existe una categoría con ese nombre'; sort_order = (MAX(sort_order) o 0) + 1.
   - updateCategory(db, id, input): void
       igual validación y chequeo de duplicado, excluyendo la propia.
   - setCategoryActive(db, id, active: boolean): void
       si active es false y tiene servicios activos, lanza
       'No se puede desactivar: tiene servicios activos'.
8. `src/db/services.ts`
   Tipo: ServiceWithCategory = ServiceRow & { category_name: string;
     category_color_key: string; category_is_active: number }.
   Esquema zod: categoryId (entero positivo), name (trim, 1 a 60),
   description (opcional, trim, máx 300; vacío se guarda como null),
   durationMin (entero entre 5 y 480, mensaje 'La duración debe ser de 5 a 480 minutos'),
   basePrice (entero, mínimo 0 con mensaje 'El precio no puede ser negativo', máximo 9999999).
   Funciones:
   - listServices(db, opts?: { categoryId?: number; includeInactive?: boolean }): ServiceWithCategory[]
       JOIN con categories. Por defecto solo servicios activos de categorías activas.
       Orden: categories.sort_order, luego services.name sin distinguir mayúsculas.
   - getService(db, id): ServiceWithCategory | null
   - createService(db, input): number
       valida; la categoría debe existir y estar activa, si no lanza 'La categoría no está disponible'.
   - updateService(db, id, input): void
       misma validación (incluida la categoría).
   - setServiceActive(db, id, active: boolean): void
9. En `app/db-debug.tsx`, agregar el botón "Probar categorías y servicios", con el mismo
   patrón de las pruebas anteriores (transacción con rollback, helpers expectOk y
   expectFail con fragmento del mensaje, mostrar el detalle de cada resultado). Pruebas:
   a. formatARS(18000) = '$ 18.000', formatARS(1234567) = '$ 1.234.567',
      formatDuration(45) = '45 min', formatDuration(60) = '1 h', formatDuration(90) = '1 h 30 min'.
   b. createCategory 'Pestañas' con 'sage': aparece en listCategories con service_count 0.
   c. createCategory 'pestanas' (sin tilde y en minúscula) debe FALLAR con 'Ya existe una categoría'.
   d. createCategory con nombre vacío debe FALLAR con 'Ingresá un nombre'.
   e. createService válido en 'Pestañas': aparece en listServices por defecto.
   f. createService con basePrice -1 debe FALLAR con 'El precio no puede ser negativo'.
   g. createService con durationMin 0 debe FALLAR con 'La duración debe ser de 5 a 480 minutos'.
   h. setCategoryActive('Pestañas', false) con un servicio activo debe FALLAR con 'servicios activos'.
   i. setServiceActive(false) y luego setCategoryActive(false) deben funcionar; después,
      listServices por defecto ya no incluye ese servicio, y con includeInactive sí.
   j. updateService moviendo un servicio a la categoría inactiva debe FALLAR con 'no está disponible'.
   Al final, listCategories(db, true) debe tener 4 categorías (el rollback dejó todo limpio).

## Criterios de aceptación
- Las 10 pruebas (a a j) aparecen en OK; las que esperan error muestran el motivo correcto.
- Después de las pruebas, las categorías son 4.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`