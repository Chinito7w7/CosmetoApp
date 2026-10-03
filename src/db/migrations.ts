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
];
