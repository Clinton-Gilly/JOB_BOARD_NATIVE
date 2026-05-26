import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { chatMessages, conversations } from '@/data/messages';
import { useAppColors } from '@/hooks/use-app-colors';

export default function ChatScreen() {
  const colors = useAppColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversation = conversations.find((item) => item.id === id);
  const messages = chatMessages[id ?? ''] ?? [];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: conversation?.name ?? 'Chat' }} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isMe = item.from === 'me';

          return (
            <View style={[styles.bubbleRow, isMe ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isMe ? '#2563EB' : colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <Text style={[styles.bubbleText, { color: isMe ? '#FFFFFF' : colors.text }]}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  bubbleRow: {
    width: '100%',
    flexDirection: 'row',
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
