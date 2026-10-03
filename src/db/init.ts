import { SQLiteDatabase } from 'expo-sqlite';
import { migrations } from './migrations';

export async function initDatabase(db: SQLiteDatabase) {
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
