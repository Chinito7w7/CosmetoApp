import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { AppText } from '@/src/components/ui';
import { Button } from '@/src/components/ui';
import { getSetting, setSetting } from '@/src/db/settings';

export default function DbDebugScreen() {
  const db = useSQLiteContext();
  const [debugInfo, setDebugInfo] = useState({
    userVersion: '...',
    foreignKeys: '...',
    tables: [] as string[],
    settings: [] as { key: string, value: string }[],
    counter: '...',
  });

  const refresh = async () => {
    const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const fk = await db.getFirstAsync<{ foreign_keys: number }>('PRAGMA foreign_keys');
    const tables = await db.getAllAsync<{ name: string }>('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"');
    const settings = await db.getAllAsync<{ key: string, value: string }>('SELECT * FROM settings');
    const counter = await getSetting(db, 'debug_counter');

    setDebugInfo({
      userVersion: String(version?.user_version ?? 0),
      foreignKeys: String(fk?.foreign_keys ?? 0),
      tables: tables.map(t => t.name),
      settings: settings,
      counter: counter ?? '0',
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const incrementCounter = async () => {
    const current = parseInt(debugInfo.counter);
    await setSetting(db, 'debug_counter', String(current + 1));
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
      </View>
    </ScrollView>
  );
}
