import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppStateProvider, useAppState } from '@/context/app-state';
import { useAppColors } from '@/hooks/use-app-colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStateProvider>
        <AppStack />
      </AppStateProvider>
    </GestureHandlerRootView>
  );
}

function AppStack() {
  const { themeMode } = useAppState();
  const colors = useAppColors();

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="job/[id]"
          options={{
            title: 'Job Detail',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
