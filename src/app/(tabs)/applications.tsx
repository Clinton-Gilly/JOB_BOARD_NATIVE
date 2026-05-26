import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/use-app-colors';

type ProposalStatus = 'Pending' | 'Viewed' | 'Accepted' | 'Rejected';

const proposals: { id: string; role: string; company: string; status: ProposalStatus }[] = [
  { id: 'p1', role: 'Mobile Product Designer', company: 'Pixel Forge', status: 'Pending' },
  { id: 'p2', role: 'React Native Engineer', company: 'Nova Labs', status: 'Viewed' },
  { id: 'p3', role: 'Growth Designer', company: 'Trailhead', status: 'Accepted' },
  { id: 'p4', role: 'Frontend Engineer', company: 'ArcFlow', status: 'Rejected' },
];

const badgeColors: Record<ProposalStatus, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Viewed: { bg: '#DBEAFE', text: '#1E3A8A' },
  Accepted: { bg: '#DCFCE7', text: '#166534' },
  Rejected: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function ApplicationsTab() {
  const colors = useAppColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Applications</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>4 active proposals</Text>
      </View>

      <View style={styles.list}>
        {proposals.map((proposal) => (
          <View key={proposal.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.cardTop}>
              <View style={styles.textWrap}>
                <Text style={[styles.role, { color: colors.text }]}>{proposal.role}</Text>
                <Text style={[styles.company, { color: colors.textMuted }]}>{proposal.company}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: badgeColors[proposal.status].bg }]}>
                <Text style={[styles.badgeText, { color: badgeColors[proposal.status].text }]}>{proposal.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  role: {
    fontSize: 16,
    fontWeight: '700',
  },
  company: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
