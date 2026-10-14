import { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';
import { parseOrThrow } from '@/src/lib/validation';
import { ServiceRow, ServiceWithCategory } from '@/src/db/types';

const serviceSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().max(300).optional().transform(val => val === '' ? null : val),
  durationMin: z.number().int().min(5, 'La duración debe ser de 5 a 480 minutos').max(480, 'La duración debe ser de 5 a 480 minutos'),
  basePrice: z.number().int().min(0, 'El precio no puede ser negativo').max(9999999),
});

export async function listServices(db: SQLiteDatabase, opts?: { categoryId?: number; includeInactive?: boolean }): Promise<ServiceWithCategory[]> {
  let query = `
    SELECT s.*, c.name as category_name, c.color_key as category_color_key, c.is_active as category_is_active
    FROM services s
    JOIN categories c ON s.category_id = c.id
  `;
  
  const conditions: string[] = [];
  if (!opts?.includeInactive) {
    conditions.push('s.is_active = 1');
    conditions.push('c.is_active = 1');
  }
  if (opts?.categoryId) {
    conditions.push(`s.category_id = ${opts.categoryId}`);
  }
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  query += ` ORDER BY c.sort_order, s.name COLLATE NOCASE`;
  
  return await db.getAllAsync<ServiceWithCategory>(query);
}

export async function getService(db: SQLiteDatabase, id: number): Promise<ServiceWithCategory | null> {
  const query = `
    SELECT s.*, c.name as category_name, c.color_key as category_color_key, c.is_active as category_is_active
    FROM services s
    JOIN categories c ON s.category_id = c.id
    WHERE s.id = ?
  `;
  return await db.getFirstAsync<ServiceWithCategory>(query, [id]);
}

export async function createService(db: SQLiteDatabase, input: any): Promise<number> {
  const validated = parseOrThrow(serviceSchema, input);
  
  const cat = await db.getFirstAsync<{ is_active: number }>('SELECT is_active FROM categories WHERE id = ?', [validated.categoryId]);
  if (!cat || cat.is_active === 0) {
    throw new Error('La categoría no está disponible');
  }
  
  const result = await db.runAsync(
    'INSERT INTO services (category_id, name, description, duration_min, base_price) VALUES (?, ?, ?, ?, ?)',
    [validated.categoryId, validated.name, validated.description ?? null, validated.durationMin, validated.basePrice]
  );
  
  return result.lastInsertRowId;
}

export async function updateService(db: SQLiteDatabase, id: number, input: any): Promise<void> {
  const validated = parseOrThrow(serviceSchema, input);
  
  const cat = await db.getFirstAsync<{ is_active: number }>('SELECT is_active FROM categories WHERE id = ?', [validated.categoryId]);
  if (!cat || cat.is_active === 0) {
    throw new Error('La categoría no está disponible');
  }
  
  await db.runAsync(
    'UPDATE services SET category_id = ?, name = ?, description = ?, duration_min = ?, base_price = ? WHERE id = ?',
    [validated.categoryId, validated.name, validated.description ?? null, validated.durationMin, validated.basePrice, id]
  );
}

export async function setServiceActive(db: SQLiteDatabase, id: number, active: boolean): Promise<void> {
  await db.runAsync('UPDATE services SET is_active = ? WHERE id = ?', [active ? 1 : 0, id]);
}
