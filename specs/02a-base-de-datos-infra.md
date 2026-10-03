# Spec 02a: Infraestructura de base de datos y migraciones

## Objetivo
Abrir SQLite al iniciar la app, con un sistema de migraciones versionadas, y
guardar/leer ajustes (tabla settings). Sin tablas de dominio todavía.

## Fuera de alcance
Tablas de clientes, servicios, turnos, etc. (spec 02b). Pantallas reales.

## Pasos (hacer a mano)
1. `npx expo install expo-sqlite`
2. Agregar a `AGENTS.md`:
   - "Base de datos: NUNCA editar una migración ya aplicada; agregar una nueva."
   - "Montos: enteros en pesos. Fechas: texto en hora local ('YYYY-MM-DD HH:MM')."

## Pasos (openCode)
3. Crear `src/db/migrations.ts`:
   - export type Migration = { version: number; up: (db: SQLiteDatabase) => Promise<void> };
   - export const migrations: Migration[] con UNA migración, version 1, cuyo `up` ejecuta con db.execAsync:
       CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
       INSERT INTO settings (key, value) VALUES
         ('professional_name', 'Milagros'),
         ('reminders_enabled', '0'),
         ('reminder_time', '06:00');
4. Crear `src/db/init.ts` con esta función (respetar la lógica):
       export async function initDatabase(db: SQLiteDatabase) {
         // Validar versiones consecutivas desde 1; si no, lanzar Error.
         await db.execAsync('PRAGMA foreign_keys = ON;');
         const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
         let current = row?.user_version ?? 0;
         for (const m of migrations) {
           if (m.version <= current) continue;
           await db.withTransactionAsync(async () => {
             await m.up(db);
             await db.execAsync(`PRAGMA user_version = ${m.version};`);
           });
           current = m.version;
         }
       }
5. Crear `src/db/index.ts` que exporte `DB_NAME = 'escorpio.db'` y `initDatabase`.
6. Crear `src/db/settings.ts` con dos funciones que reciben `db` como primer parámetro:
   - getSetting(db, key): Promise<string | null>
       usa db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key)
   - setSetting(db, key, value): Promise<void>
       INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value
7. En `app/_layout.tsx`, SIN quitar la carga de fuentes ni el splash:
   - Envolver lo que se renderiza (ya cargadas las fuentes) con
     <Suspense fallback={null}> y <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase} useSuspense>.
8. Crear `app/db-debug.tsx` (pantalla TEMPORAL) con useSQLiteContext(). Debe mostrar:
   - PRAGMA user_version
   - PRAGMA foreign_keys
   - Lista de tablas (SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%')
   - Todas las filas de settings
   - Un botón "Sumar contador" que usa getSetting/setSetting con la clave 'debug_counter'
     (si no existe vale 0), lo incrementa y refresca la pantalla.
9. En `app/(tabs)/ajustes.tsx`, agregar un segundo botón tonal "Debug base de datos (temporal)"
   que navegue a '/db-debug'.

## Criterios de aceptación
- La app abre sin errores y sin pantalla en blanco al iniciar.
- En la pantalla de debug: user_version = 1, foreign_keys = 1, una sola tabla (settings)
  y tres ajustes con sus valores por defecto (Milagros, 0, 06:00).
- "Sumar contador" incrementa el número en pantalla.
- Cerrar la app por completo (sacarla de recientes) y volver a abrirla: el contador
  conserva su valor.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`