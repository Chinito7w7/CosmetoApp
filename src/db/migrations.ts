import { SQLiteDatabase } from 'expo-sqlite';

export type Migration = {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
};

export const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
        INSERT INTO settings (key, value) VALUES
          ('professional_name', 'Milagros'),
          ('reminders_enabled', '0'),
          ('reminder_time', '06:00');
      `);
    },
  },
  {
    version: 2,
    up: async (db) => {
      await db.execAsync(`
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
      `);
    },
  },
];
