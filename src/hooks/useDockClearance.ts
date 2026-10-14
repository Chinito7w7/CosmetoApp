import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useDockClearance() {
  const [clearance, setClearance] = useState(0);

  useEffect(() => {
    // Approximate height of the dock component in the app
    // based on design: it's usually around 80-100px
    setClearance(80);
  }, []);

  return clearance;
}
