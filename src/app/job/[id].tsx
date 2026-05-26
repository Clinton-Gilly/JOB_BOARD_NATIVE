import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppState } from '@/context/app-state';
import { CATEGORY_COLORS, jobsSeed } from '@/data/jobs';
import { useAppColors } from '@/hooks/use-app-colors';

export default function JobDetailScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { getPaymentState, updatePaymentState, resetPaymentState } = useAppState();
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = jobsSeed.find((item) => item.id === id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const payment = job ? getPaymentState(job.id) : null;
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timer) => clearTimeout(timer));
      timeouts.current = [];
    };
  }, []);

  const runPaymentSimulation = () => {
    if (!job || !payment) {
      return;
    }

    updatePaymentState(job.id, { status: 'processing' });

    const firstDelay = setTimeout(() => {
      if (payment.simulateFailure) {
        updatePaymentState(job.id, { status: 'failure' });
        return;
      }

      updatePaymentState(job.id, { status: 'prompt' });

      const secondDelay = setTimeout(() => {
        updatePaymentState(job.id, {
          status: 'success',
          receipt: 'NLJ7RT61SV',
        });
      }, 3000);

      timeouts.current.push(secondDelay);
    }, 2000);

    timeouts.current.push(firstDelay);
  };

  if (!job) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Job Detail' }} />
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Job not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const employerInitial = job.employer.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Job Detail', headerBackTitle: 'Feed' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.topRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{employerInitial}</Text>
            </View>
            <View style={styles.companyBlock}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
              <Text style={[styles.companyName, { color: colors.textMuted }]}>{job.employer}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.categoryChip, { backgroundColor: CATEGORY_COLORS[job.category] }]}>
              <Text style={styles.categoryText}>{job.category}</Text>
            </View>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{job.location}</Text>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{job.postedAt}</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Budget</Text>
          <Text style={[styles.sectionValue, { color: colors.text }]}>{job.budget} / project</Text>
          {payment?.status === 'success' && (
            <View style={styles.fundedBanner}>
              <Text style={styles.fundedBannerText}>Escrow funded</Text>
            </View>
          )}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Required Skills</Text>
          <View style={styles.tagsWrap}>
            {job.skills.map((skill) => (
              <View key={skill} style={[styles.skillTag, { backgroundColor: colors.chipBg }]}>
                <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About this role</Text>
          <Text style={[styles.descriptionText, { color: colors.textMuted }]}>{job.description}</Text>
          <Text style={[styles.descriptionText, { color: colors.textMuted }]}>
            This is mock content for the detail screen. In a production app this area would include
            full responsibilities, requirements, company information, and an application flow.
          </Text>
        </View>

        <Pressable style={styles.applyButton}>
          <Ionicons name="send" size={18} color="#0B1020" />
          <Text style={styles.applyText}>Apply Now</Text>
        </Pressable>

        <Pressable style={styles.escrowButton} onPress={() => setIsPaymentModalOpen(true)}>
          <Ionicons name="wallet" size={18} color="#052E16" />
          <Text style={styles.escrowButtonText}>
            {payment?.status === 'success' ? 'Escrow Funded' : 'Fund Escrow'}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isPaymentModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPaymentModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Fund Escrow via M-Pesa</Text>
              <Pressable onPress={() => setIsPaymentModalOpen(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Amount</Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountText}>{job.budget}</Text>
            </View>

            <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Phone Number</Text>
            <TextInput
              value={payment?.phone ?? '0712345678'}
              editable={payment?.status !== 'processing' && payment?.status !== 'prompt'}
              onChangeText={(value) => updatePaymentState(job.id, { phone: value })}
              style={[styles.phoneInput, { borderColor: colors.inputBorder, color: colors.text }]}
              keyboardType="phone-pad"
            />

            <View style={styles.toggleRow}>
              <Text style={[styles.toggleText, { color: colors.text }]}>Simulate Failure</Text>
              <Switch
                value={Boolean(payment?.simulateFailure)}
                onValueChange={(value) => updatePaymentState(job.id, { simulateFailure: value })}
              />
            </View>

            {(payment?.status === 'idle' || payment?.status === 'failure') && (
              <Pressable style={styles.payButton} onPress={runPaymentSimulation}>
                <Text style={styles.payButtonText}>Pay via M-Pesa</Text>
              </Pressable>
            )}

            {payment?.status === 'processing' && (
              <View style={styles.processingBox}>
                <ActivityIndicator size="large" color="#16A34A" />
                <Text style={[styles.processingText, { color: colors.text }]}>Sending STK Push...</Text>
              </View>
            )}

            {payment?.status === 'prompt' && (
              <View style={[styles.infoBox, styles.infoBoxBlue]}>
                <Text style={styles.infoTextBlue}>Check your phone — M-Pesa prompt sent</Text>
              </View>
            )}

            {payment?.status === 'success' && (
              <View style={[styles.infoBox, styles.infoBoxGreen]}>
                <Text style={styles.infoTitleGreen}>Escrow Funded Successfully</Text>
                <Text style={styles.infoTextGreen}>Receipt: {payment.receipt ?? 'NLJ7RT61SV'}</Text>
              </View>
            )}

            {payment?.status === 'failure' && (
              <View style={[styles.infoBox, styles.infoBoxRed]}>
                <Text style={styles.infoTextRed}>Payment failed — insufficient funds. Try again.</Text>
                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    resetPaymentState(job.id);
                  }}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  companyBlock: {
    flex: 1,
    gap: 3,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  companyName: {
    fontSize: 15,
    color: '#334155',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryText: {
    fontWeight: '700',
    color: '#1E293B',
  },
  metaText: {
    color: '#475569',
    fontSize: 13,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionValue: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '800',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  skillText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionText: {
    color: '#334155',
    lineHeight: 22,
    fontSize: 15,
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: '#A7F3D0',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  applyText: {
    color: '#0B1020',
    fontSize: 15,
    fontWeight: '800',
  },
  escrowButton: {
    marginTop: 2,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  escrowButtonText: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: '800',
  },
  fundedBanner: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  fundedBannerText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  modalLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '700',
  },
  amountBox: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  amountText: {
    color: '#1E1B4B',
    fontSize: 22,
    fontWeight: '800',
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 2,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  processingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  infoBoxBlue: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  infoTextBlue: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 14,
  },
  infoBoxGreen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  infoTitleGreen: {
    color: '#14532D',
    fontSize: 15,
    fontWeight: '800',
  },
  infoTextGreen: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  infoBoxRed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  infoTextRed: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '700',
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#991B1B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
