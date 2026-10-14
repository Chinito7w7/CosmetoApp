# Spec 02b: Esquema del dominio (migración 2), tipos y pruebas de restricciones

## Objetivo
Crear todas las tablas del dominio con sus restricciones, cargar las categorías
iniciales y demostrar que la base rechaza datos inválidos.

## Fuera de alcance
Consultas y repositorios (van en cada spec de funcionalidad). Pantallas reales.
NO editar la migración 1.

## Pasos (hacer a mano)
1. En `src/db/migrations.ts`, agregar una segunda migración { version: 2, up } cuyo `up`
   ejecute con db.execAsync (un solo string con todo el SQL):

   CREATE TABLE categories (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL UNIQUE COLLATE NOCASE,
     color_key TEXT NOT NULL,
     sort_order INTEGER NOT NULL DEFAULT 0,
     is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE TABLE services (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     category_id INTEGER NOT NULL REFERENCES categories(id),
     name TEXT NOT NULL,
     description TEXT,
     duration_min INTEGER NOT NULL CHECK (duration_min > 0),
     base_price INTEGER NOT NULL CHECK (base_price >= 0),
     is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE INDEX idx_services_category ON services(category_id);
   CREATE TABLE clients (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     full_name TEXT NOT NULL,
     phone TEXT NOT NULL,
     birth_date TEXT,
     email TEXT,
     occupation TEXT,
     alert_text TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE TABLE appointments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     client_id INTEGER NOT NULL REFERENCES clients(id),
     starts_at TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending', 'completed', 'cancelled')),
     notes TEXT,
     due_date TEXT,
     completed_at TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE INDEX idx_appointments_starts_at ON appointments(starts_at);
   CREATE INDEX idx_appointments_client ON appointments(client_id);
   CREATE TABLE appointment_services (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
     service_id INTEGER NOT NULL REFERENCES services(id),
     service_name TEXT NOT NULL,
     duration_min INTEGER NOT NULL CHECK (duration_min > 0),
     price INTEGER NOT NULL CHECK (price >= 0)
   );
   CREATE INDEX idx_appt_services_appointment ON appointment_services(appointment_id);
   CREATE INDEX idx_appt_services_service ON appointment_services(service_id);
   CREATE TABLE payments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
     amount INTEGER NOT NULL CHECK (amount > 0),
     method TEXT NOT NULL CHECK (method IN ('cash', 'transfer', 'mercadopago', 'card')),
     paid_at TEXT NOT NULL,
     note TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE INDEX idx_payments_appointment ON payments(appointment_id);
   CREATE INDEX idx_payments_paid_at ON payments(paid_at);
   CREATE TABLE ficha_versions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
     type TEXT NOT NULL DEFAULT 'cosmetologica',
     data TEXT NOT NULL CHECK (json_valid(data)),
     created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
   );
   CREATE INDEX idx_ficha_client ON ficha_versions(client_id, created_at);
   CREATE TRIGGER ficha_versions_no_update BEFORE UPDATE ON ficha_versions
   BEGIN
     SELECT RAISE(ABORT, 'ficha_versions es inmutable');
   END;
   INSERT INTO categories (name, color_key, sort_order) VALUES
     ('Cosmetología', 'rose', 1),
     ('Maquillaje', 'salmon', 2),
     ('Uñas', 'peach', 3),
     ('Otros', 'sand', 4);

## Pasos (openCode)
2. Crear `src/db/types.ts` con tipos que reflejen las tablas (nombres de campo en
   snake_case, igual que las columnas):
   - AppointmentStatus = 'pending' | 'completed' | 'cancelled'
   - PaymentMethod = 'cash' | 'transfer' | 'mercadopago' | 'card'
   - CategoryRow, ServiceRow, ClientRow, AppointmentRow, AppointmentServiceRow,
     PaymentRow, FichaVersionRow.
   Los campos opcionales de la tabla son `string | null`; los booleanos (is_active) son number (0 | 1).
3. En `app/db-debug.tsx` agregar un botón "Probar restricciones" que ejecute todo dentro
   de db.withTransactionAsync y al final lance un error propio (RollbackSignal) para deshacer.
   Cada prueba va en su try/catch, guarda un resultado { nombre, ok } y se muestra en pantalla
   como OK o FALLÓ. Pruebas:
   a. Insertar un servicio con category_id 9999 debe FALLAR (clave foránea).
   b. Insertar un turno con status 'otro' debe FALLAR (CHECK).
   c. Insertar un pago con amount 0 debe FALLAR (CHECK).
   d. Insertar una categoría 'cosmetología' (minúsculas) debe FALLAR (nombre único).
   e. Insertar una ficha con data 'no es json' debe FALLAR (json_valid).
   f. Insertar una clienta y una ficha válida; luego un UPDATE sobre esa ficha debe FALLAR (trigger).
   g. Insertar un servicio válido en la categoría 'Cosmetología'; luego borrar esa categoría
      debe FALLAR (clave foránea).
   h. Flujo válido: clienta, turno, servicio del turno y pago, todos deben insertarse
      sin error (esta prueba espera ÉXITO).
   Después de la transacción, mostrar el conteo de categorías (debe ser 4: prueba de que
   el rollback dejó la base limpia).

## Criterios de aceptación
- Al abrir la app, la pantalla de debug muestra user_version = 2 (sin desinstalar nada).
- Las tablas listadas son 8: settings, categories, services, clients, appointments,
  appointment_services, payments y ficha_versions.
- El contador de la prueba anterior conserva su valor (los datos sobrevivieron a la migración).
- Las 8 pruebas (a a h) aparecen como OK.
- Después de las pruebas, el conteo de categorías sigue siendo 4.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`