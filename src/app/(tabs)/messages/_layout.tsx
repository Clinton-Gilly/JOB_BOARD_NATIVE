import { Stack } from 'expo-router';

import { useAppColors } from '@/hooks/use-app-colors';

export default function MessagesStackLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Messages' }} />
      <Stack.Screen name="[id]" options={{ title: 'Chat' }} />
    </Stack>
  );
}
