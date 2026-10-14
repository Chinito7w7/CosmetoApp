import { AppText, Button } from '@/src/components/ui';
import { createCategory, listCategories, setCategoryActive } from '@/src/db/categories';
import { createService, listServices, setServiceActive, updateService } from '@/src/db/services';
import { getSetting, setSetting } from '@/src/db/settings';
import { formatARS, formatDuration } from '@/src/lib/format';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

class RollbackSignal extends Error {
  constructor() {
    super('Rollback');
    this.name = 'RollbackSignal';
  }
}

export default function DbDebugScreen() {
  const db = useSQLiteContext();
  const [debugInfo, setDebugInfo] = useState({
    userVersion: '...',
    foreignKeys: '...',
    tables: [] as string[],
    settings: [] as { key: string, value: string }[],
    counter: '...',
    testResults: [] as { nombre: string, ok: boolean, msg?: string }[],
  });

  const refresh = async () => {
    const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const fk = await db.getFirstAsync<{ foreign_keys: number }>('PRAGMA foreign_keys');
    const tables = await db.getAllAsync<{ name: string }>('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"');
    const settings = await db.getAllAsync<{ key: string, value: string }>('SELECT * FROM settings');
    const counter = await getSetting(db, 'debug_counter');

    setDebugInfo(prev => ({
      ...prev,
      userVersion: String(version?.user_version ?? 0),
      foreignKeys: String(fk?.foreign_keys ?? 0),
      tables: tables.map(t => t.name),
      settings: settings,
      counter: counter ?? '0',
    }));
  };

  useEffect(() => {
    refresh();
  }, []);

  const runTests = async () => {
    const results: { nombre: string, ok: boolean, msg?: string }[] = [];
    
    try {
      await db.withTransactionAsync(async () => {
        const expectOk = async (nombre: string, fn: () => Promise<void>) => {
          try {
            await fn();
            results.push({ nombre, ok: true });
          } catch (e: any) {
            results.push({ nombre, ok: false, msg: e.message });
          }
        };

        const expectFail = async (nombre: string, fn: () => Promise<void>, expectedMsg?: string) => {
          try {
            await fn();
            results.push({ nombre, ok: false, msg: 'No falló' });
          } catch (e: any) {
            const ok = expectedMsg ? e.message.includes(expectedMsg) : true;
            results.push({ nombre, ok, msg: ok ? 'OK' : e.message });
          }
        };

        // a. Formatos
        results.push({ nombre: 'formatARS 18k', ok: formatARS(18000) === '$ 18.000' });
        results.push({ nombre: 'formatARS 1.2M', ok: formatARS(1234567) === '$ 1.234.567' });
        results.push({ nombre: 'formatDur 45', ok: formatDuration(45) === '45 min' });
        results.push({ nombre: 'formatDur 60', ok: formatDuration(60) === '1 h' });
        results.push({ nombre: 'formatDur 90', ok: formatDuration(90) === '1 h 30 min' });

        // b. createCategory Pestañas
        await expectOk('Create Cat Pestañas', async () => {
          await createCategory(db, { name: 'Pestañas', colorKey: 'sage' });
        });
        const cats = await listCategories(db);
        results.push({ nombre: 'Cat Pestañas in list', ok: cats.some(c => c.name === 'Pestañas' && c.service_count === 0) });

        // c. Duplicate Cat
        await expectFail('Cat Duplicate', async () => {
          await createCategory(db, { name: 'pestanas', colorKey: 'sage' });
        }, 'Ya existe una categoría');

        // d. Empty Cat
        await expectFail('Cat Empty Name', async () => {
          await createCategory(db, { name: '', colorKey: 'sage' });
        }, 'Ingresá un nombre');

        // e. Valid Service
        await expectOk('Create Service', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          await createService(db, { 
            categoryId: cat?.id ?? 0, 
            name: 'Lifting', 
            durationMin: 60, 
            basePrice: 15000 
          });
        });
        const svcs = await listServices(db);
        results.push({ nombre: 'Service in list', ok: svcs.some(s => s.name === 'Lifting') });

        // f. Service Price -1
        await expectFail('Svc Price -1', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          await createService(db, { categoryId: cat?.id ?? 0, name: 'Error', durationMin: 30, basePrice: -1 });
        }, 'El precio no puede ser negativo');

        // g. Service Duration 0
        await expectFail('Svc Duration 0', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          await createService(db, { categoryId: cat?.id ?? 0, name: 'Error', durationMin: 0, basePrice: 1000 });
        }, 'La duración debe ser de 5 a 480 minutos');

        // h. Deactivate Category w/ Active Svc
        await expectFail('Deact Cat w/ Svc', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          await setCategoryActive(db, cat?.id ?? 0, false);
        }, 'servicios activos');

        // i. Deactivate Svc then Cat
        await expectOk('Deact Svc then Cat', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          const svc = await db.getFirstAsync<{ id: number }>('SELECT id FROM services WHERE name = "Lifting"');
          await setServiceActive(db, svc?.id ?? 0, false);
          await setCategoryActive(db, cat?.id ?? 0, false);
        });
        const activeSvcs = await listServices(db);
        results.push({ nombre: 'Svc not in active list', ok: !activeSvcs.some(s => s.name === 'Lifting') });

        // j. Update Svc to Inactive Cat
        await expectFail('Update Svc to Inactive Cat', async () => {
          const cat = await db.getFirstAsync<{ id: number }>('SELECT id FROM categories WHERE name = "Pestañas"');
          const svc = await db.getFirstAsync<{ id: number }>('SELECT id FROM services WHERE name = "Lifting"');
          await updateService(db, svc?.id ?? 0, { 
            categoryId: cat?.id ?? 0, 
            name: 'Lifting', 
            durationMin: 60, 
            basePrice: 15000 
          });
        }, 'no está disponible');

        throw new RollbackSignal();
      });
    } catch (e) {
      if (!(e instanceof RollbackSignal)) {
        console.error(e);
      }
    }

    setDebugInfo(prev => ({ ...prev, testResults: results }));
    await refresh();
  };

  const incrementCounter = async () => {
    const current = parseInt(debugInfo.counter);
    await setSetting(db, 'debug_counter', String(current + 1));
    await refresh();
  };

  const loadDemoServices = async () => {
    const existing = await db.getFirstAsync('SELECT id FROM services WHERE name LIKE "DEMO %" LIMIT 1');
    if (existing) return;

    const categories = await listCategories(db, true);
    const getCatId = (name: string) => categories.find(c => c.name === name)?.id ?? 0;

    const demoData = [
      { cat: 'Cosmetología', name: 'DEMO Limpieza facial profunda', dur: 60, price: 18000 },
      { cat: 'Cosmetología', name: 'DEMO Peeling renovador', dur: 45, price: 22000 },
      { cat: 'Cosmetología', name: 'DEMO Dermaplaning', dur: 50, price: 20000, desc: 'Exfoliación con bisturí y sérum' },
      { cat: 'Maquillaje', name: 'DEMO Maquillaje social', dur: 60, price: 25000 },
      { cat: 'Maquillaje', name: 'DEMO Maquillaje de novia', dur: 120, price: 60000, inactive: true },
      { cat: 'Uñas', name: 'DEMO Semipermanente', dur: 90, price: 12000 },
    ];

    for (const item of demoData) {
      const id = await createService(db, {
        categoryId: getCatId(item.cat),
        name: item.name,
        durationMin: item.dur,
        basePrice: item.price,
        description: item.desc,
      });
      if (item.inactive) {
        await setServiceActive(db, id, false);
      }
    }
    await refresh();
  };

  const clearDemoServices = async () => {
    await db.runAsync('DELETE FROM services WHERE name LIKE "DEMO %"');
    await refresh();
  };

  return (

    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-6 py-10">
        <AppText variant="headline-xl" tone="ink">Debug Database</AppText>
        
        <View className="gap-2">
          <AppText variant="body-md" tone="taupe">PRAGMA user_version: <AppText variant="body-md" tone="ink">{debugInfo.userVersion}</AppText></AppText>
          <AppText variant="body-md" tone="taupe">PRAGMA foreign_keys: <AppText variant="body-md" tone="ink">{debugInfo.foreignKeys}</AppText></AppText>
        </View>

        <View className="gap-2">
          <AppText variant="headline-sm" tone="ink">Tablas</AppText>
          {debugInfo.tables.map(t => (
            <AppText key={t} variant="body-md" tone="taupe">• {t}</AppText>
          ))}
        </View>

        <View className="gap-2">
          <AppText variant="headline-sm" tone="ink">Settings</AppText>
          {debugInfo.settings.map(s => (
            <AppText key={s.key} variant="body-sm" tone="taupe">{s.key}: {s.value}</AppText>
          ))}
        </View>

         <View className="gap-2">
           <AppText variant="headline-sm" tone="ink">Debug Counter</AppText>
           <AppText variant="headline-lg" tone="primary">{debugInfo.counter}</AppText>
           <Button label="Sumar contador" onPress={incrementCounter} variant="primary" />
         </View>

         <View className="gap-2">
           <AppText variant="headline-sm" tone="ink">Datos de Prueba</AppText>
           <View className="flex-row gap-2">
             <Button label="Cargar DEMO" onPress={loadDemoServices} variant="tonal" fullWidth />
             <Button label="Borrar DEMO" onPress={clearDemoServices} variant="outline" fullWidth />
           </View>
         </View>

         <View className="gap-4 mt-4">

          <AppText variant="headline-sm" tone="ink">Pruebas de Restricciones</AppText>
          <Button label="Ejecutar Pruebas" onPress={runTests} variant="outline" />
          <View className="gap-1">
            {debugInfo.testResults.map((r, i) => (
              <View key={i} className="flex-row justify-between items-center bg-surface p-2 rounded border border-line">
                <AppText variant="body-sm" tone="taupe">{r.nombre}</AppText>
                <AppText variant="body-sm" className={r.ok ? 'text-success' : 'text-danger-fg'}>
                  {r.ok ? 'OK' : 'FALLÓ'}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
