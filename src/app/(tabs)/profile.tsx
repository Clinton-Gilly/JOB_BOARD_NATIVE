import { Switch, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppState } from '@/context/app-state';
import { useAppColors } from '@/hooks/use-app-colors';

const skills = ['React Native', 'UI Design', 'Product Thinking', 'Communication'];

export default function ProfileTab() {
  const colors = useAppColors();
  const { themeMode, toggleThemeMode } = useAppState();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.name, { color: colors.text }]}>Alex Mwangi</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>Member since Jan 2023</Text>
          <Text style={[styles.earnings, { color: colors.text }]}>Total earnings: KES 482,000</Text>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Skills</Text>
          <View style={styles.skillsWrap}>
            {skills.map((skill) => (
              <View key={skill} style={[styles.skillChip, { backgroundColor: colors.chipBg }]}>
                <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingName, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingHint, { color: colors.textMuted }]}>Toggle app appearance</Text>
            </View>
            <Switch value={themeMode === 'dark'} onValueChange={toggleThemeMode} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
  },
  meta: {
    fontSize: 14,
  },
  earnings: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 2,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingTextWrap: {
    flex: 1,
    gap: 2,
  },
  settingName: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingHint: {
    fontSize: 13,
  },
});
