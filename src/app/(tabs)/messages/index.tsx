import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { conversations } from '@/data/messages';
import { useAppColors } from '@/hooks/use-app-colors';

export default function MessagesTab() {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.list}>
        {conversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => router.push({ pathname: '/messages/[id]', params: { id: conversation.id } })}>
            <View style={styles.rowTop}>
              <Text style={[styles.name, { color: colors.text }]}>{conversation.name}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{conversation.updatedAt}</Text>
            </View>
            <Text style={[styles.role, { color: colors.textMuted }]}>{conversation.role}</Text>
            <Text style={[styles.preview, { color: colors.text }]} numberOfLines={1}>
              {conversation.preview}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 5,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  time: {
    fontSize: 12,
  },
  role: {
    fontSize: 13,
  },
  preview: {
    fontSize: 14,
  },
});
