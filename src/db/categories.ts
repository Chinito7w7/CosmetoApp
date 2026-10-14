import { CategoryRow } from '@/src/db/types';
import { parseOrThrow } from '@/src/lib/validation';
import { COLOR_KEYS } from '@/src/theme/categoryColors';
import { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';

export type CategoryWithCount = CategoryRow & { service_count: number };

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Ingresá un nombre').max(30, 'Máximo 30 caracteres'),
  colorKey: z.enum(COLOR_KEYS),
});

function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function nameExists(db: SQLiteDatabase, name: string, excludeId?: number): Promise<boolean> {
  const rows = await db.getAllAsync<{ id: number; name: string }>('SELECT id, name FROM categories');
  const target = normalizeName(name);
  return rows.some((r) => r.id !== excludeId && normalizeName(r.name) === target);
}

export async function listCategories(db: SQLiteDatabase, includeInactive = false): Promise<CategoryWithCount[]> {
  const query = includeInactive 
    ? `SELECT c.*, (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.is_active = 1) as service_count 
       FROM categories c ORDER BY c.sort_order, c.name COLLATE NOCASE`
    : `SELECT c.*, (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.is_active = 1) as service_count 
       FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order, c.name COLLATE NOCASE`;
  
  return await db.getAllAsync<CategoryWithCount>(query);
}

export async function createCategory(db: SQLiteDatabase, input: { name: string; colorKey: string }): Promise<number> {
  const validated = parseOrThrow(categorySchema, input);
  
  if (await nameExists(db, validated.name)) {
    throw new Error('Ya existe una categoría con ese nombre');
  }
  
  const maxOrder = await db.getFirstAsync<{ max: number }>('SELECT MAX(sort_order) as max FROM categories');
  const nextOrder = (maxOrder?.max ?? 0) + 1;
  
  const result = await db.runAsync(
    'INSERT INTO categories (name, color_key, sort_order) VALUES (?, ?, ?)',
    [validated.name, validated.colorKey, nextOrder]
  );
  
  return result.lastInsertRowId;
}

export async function updateCategory(db: SQLiteDatabase, id: number, input: { name: string; colorKey: string }): Promise<void> {
  const validated = parseOrThrow(categorySchema, input);
  
  if (await nameExists(db, validated.name, id)) {
    throw new Error('Ya existe una categoría con ese nombre');
  }
  
  await db.runAsync(
    'UPDATE categories SET name = ?, color_key = ? WHERE id = ?',
    [validated.name, validated.colorKey, id]
  );
}

export async function setCategoryActive(db: SQLiteDatabase, id: number, active: boolean): Promise<void> {
  if (!active) {
    const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM services WHERE category_id = ? AND is_active = 1', [id]);
    if (count && count.count > 0) {
      throw new Error('No se puede desactivar: tiene servicios activos');
    }
  }
  
  await db.runAsync('UPDATE categories SET is_active = ? WHERE id = ?', [active ? 1 : 0, id]);
}
