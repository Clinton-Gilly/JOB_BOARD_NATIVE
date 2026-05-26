import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'job-board-app-state-v1';

type ThemeMode = 'light' | 'dark';

type PaymentStatusType = 'idle' | 'processing' | 'prompt' | 'success' | 'failure';

export type JobPaymentState = {
  status: PaymentStatusType;
  phone: string;
  simulateFailure: boolean;
  receipt?: string;
};

type AppPersistedState = {
  themeMode: ThemeMode;
  payments: Record<string, JobPaymentState>;
};

type AppStateContextValue = {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  getPaymentState: (jobId: string) => JobPaymentState;
  updatePaymentState: (jobId: string, patch: Partial<JobPaymentState>) => void;
  resetPaymentState: (jobId: string) => void;
};

const defaultPaymentState: JobPaymentState = {
  status: 'idle',
  phone: '0712345678',
  simulateFailure: false,
};

const defaultState: AppPersistedState = {
  themeMode: 'light',
  payments: {},
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppPersistedState>(defaultState);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw) as AppPersistedState;
          setState({
            themeMode: parsed.themeMode ?? 'light',
            payments: parsed.payments ?? {},
          });
        }
      } catch {
        // Ignore persistence errors for mock-only demo state.
      } finally {
        if (mounted) {
          setHasHydrated(true);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Ignore persistence errors for mock-only demo state.
    });
  }, [state, hasHydrated]);

  const value = useMemo<AppStateContextValue>(() => {
    return {
      themeMode: state.themeMode,
      toggleThemeMode: () => {
        setState((current) => ({
          ...current,
          themeMode: current.themeMode === 'light' ? 'dark' : 'light',
        }));
      },
      getPaymentState: (jobId: string) => {
        return state.payments[jobId] ?? defaultPaymentState;
      },
      updatePaymentState: (jobId: string, patch: Partial<JobPaymentState>) => {
        setState((current) => ({
          ...current,
          payments: {
            ...current.payments,
            [jobId]: {
              ...(current.payments[jobId] ?? defaultPaymentState),
              ...patch,
            },
          },
        }));
      },
      resetPaymentState: (jobId: string) => {
        setState((current) => ({
          ...current,
          payments: {
            ...current.payments,
            [jobId]: defaultPaymentState,
          },
        }));
      },
    };
  }, [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
