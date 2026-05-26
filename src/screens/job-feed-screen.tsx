import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  allCategories,
  allLocations,
  CATEGORY_COLORS,
  getRefreshedJobs,
  jobsSeed,
  JobCategory,
  JobItem,
} from '@/data/jobs';
import { useAppColors } from '@/hooks/use-app-colors';

export default function JobFeedScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const sheetRef = useRef<BottomSheet>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const [appliedCategory, setAppliedCategory] = useState<JobCategory | 'All'>('All');
  const [appliedLocation, setAppliedLocation] = useState('All');
  const [draftCategory, setDraftCategory] = useState<JobCategory | 'All'>('All');
  const [draftLocation, setDraftLocation] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(jobsSeed);
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.employer.toLowerCase().includes(normalizedQuery) ||
        job.skills.join(' ').toLowerCase().includes(normalizedQuery);

      const matchesCategory = appliedCategory === 'All' || job.category === appliedCategory;
      const matchesLocation = appliedLocation === 'All' || job.location === appliedLocation;

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [jobs, query, appliedCategory, appliedLocation]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setJobs(getRefreshedJobs());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const openFilters = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const closeFilters = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedCategory(draftCategory);
    setAppliedLocation(draftLocation);
    closeFilters();
  }, [draftCategory, draftLocation, closeFilters]);

  const resetFilters = useCallback(() => {
    setDraftCategory('All');
    setDraftLocation('All');
    setAppliedCategory('All');
    setAppliedLocation('All');
    closeFilters();
  }, [closeFilters]);

  const renderItem = ({ item }: { item: JobItem }) => {
    return (
      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => router.push({ pathname: '/job/[id]', params: { id: item.id } })}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.employer.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.employerText, { color: colors.textMuted }]}>{item.employer}</Text>
          </View>
          <View style={[styles.categoryChip, { backgroundColor: CATEGORY_COLORS[item.category] }]}>
            <Text style={styles.categoryChipText}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.budget}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.location}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.postedAt}</Text>
        </View>

        <View style={styles.skillsRow}>
          {item.skills.slice(0, 3).map((skill) => (
            <View key={`${item.id}-${skill}`} style={[styles.skillTag, { backgroundColor: colors.chipBg }]}>
              <Text style={[styles.skillTagText, { color: colors.text }]}>{skill}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  const renderSkeletonCard = (index: number) => (
    <View key={`skeleton-${index}`} style={[styles.card, styles.skeletonCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.skeletonLine, { width: '60%', height: 18 }]} />
      <View style={[styles.skeletonLine, { width: '38%', height: 14 }]} />
      <View style={[styles.skeletonLine, { width: '80%', height: 12 }]} />
      <View style={styles.skeletonPillsRow}>
        <View style={[styles.skeletonPill, { width: 72 }]} />
        <View style={[styles.skeletonPill, { width: 88 }]} />
      </View>
    </View>
  );

  const snapPoints = useMemo(() => ['58%'], []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerSection}>
        <Text style={[styles.heading, { color: colors.text }]}>Job Feed</Text>
        <Text style={[styles.subheading, { color: colors.textMuted }]}>15 roles curated for mobile creators</Text>
      </View>

      <View style={[styles.searchWrap, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title, company, or skill"
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {isLoading ? (
        <View style={styles.listWrap}>{Array.from({ length: 6 }).map((_, idx) => renderSkeletonCard(idx))}</View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listWrap}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching jobs</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Try adjusting search terms or filters.</Text>
            </View>
          }
        />
      )}

      <Pressable style={styles.fab} onPress={openFilters}>
        <Ionicons name="options" size={22} color="#FFFFFF" />
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />}>
        <BottomSheetView style={styles.sheetContent}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>Filter Jobs</Text>

          <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Category</Text>
          <View style={styles.filterWrap}>
            {allCategories.map((category) => (
              <Pressable
                key={category}
                style={[styles.filterChip, draftCategory === category && styles.filterChipActive]}
                onPress={() => setDraftCategory(category)}>
                <Text
                  style={[
                    styles.filterChipText,
                    draftCategory === category && styles.filterChipTextActive,
                  ]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Location</Text>
          <View style={styles.filterWrap}>
            {allLocations.map((location) => (
              <Pressable
                key={location}
                style={[styles.filterChip, draftLocation === location && styles.filterChipActive]}
                onPress={() => setDraftLocation(location)}>
                <Text
                  style={[
                    styles.filterChipText,
                    draftLocation === location && styles.filterChipTextActive,
                  ]}>
                  {location}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sheetButtonsRow}>
            <Pressable style={styles.secondaryButton} onPress={resetFilters}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={applyFilters}>
              <Text style={styles.primaryButtonText}>Apply</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 4,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 14,
  },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  listWrap: {
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 14,
  },
  headerTextWrap: {
    flex: 1,
    gap: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  employerText: {
    fontSize: 13,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryChipText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    color: '#94A3B8',
    fontSize: 13,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skeletonCard: {
    gap: 10,
  },
  skeletonLine: {
    backgroundColor: '#334155',
    opacity: 0.25,
    borderRadius: 8,
  },
  skeletonPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  skeletonPill: {
    height: 24,
    borderRadius: 10,
    backgroundColor: '#334155',
    opacity: 0.25,
  },
  emptyState: {
    paddingTop: 36,
    alignItems: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 26,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  filterLabel: {
    marginTop: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: '#1D4ED8',
  },
  filterChipText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sheetButtonsRow: {
    marginTop: 'auto',
    marginBottom: 12,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#052E16',
    fontWeight: '800',
  },
});
