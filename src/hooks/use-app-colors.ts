import { useMemo } from 'react';

import { useAppState } from '@/context/app-state';

const lightColors = {
  background: '#F4F7FB',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#475569',
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  chipBg: '#EEF2FF',
  tabActive: '#2563EB',
  tabInactive: '#64748B',
};

const darkColors = {
  background: '#0B1220',
  card: '#111827',
  cardBorder: '#1F2937',
  text: '#E5E7EB',
  textMuted: '#9CA3AF',
  inputBg: '#0F172A',
  inputBorder: '#334155',
  chipBg: '#1E293B',
  tabActive: '#60A5FA',
  tabInactive: '#94A3B8',
};

export function useAppColors() {
  const { themeMode } = useAppState();

  return useMemo(() => {
    return themeMode === 'dark' ? darkColors : lightColors;
  }, [themeMode]);
}
