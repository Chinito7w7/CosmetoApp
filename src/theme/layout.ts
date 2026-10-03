import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const DOCK_HEIGHT = 64;
export const DOCK_GAP = 16;

export function useDockClearance() {
  const insets = useSafeAreaInsets();
  return DOCK_HEIGHT + DOCK_GAP + insets.bottom;
}
