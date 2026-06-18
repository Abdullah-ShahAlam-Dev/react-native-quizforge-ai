import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import { fetchQuizRecords } from '../services/records.service';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' • ' +
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
};

const getScoreColor = (score, total) => {
  const pct = (score / total) * 100;
  if (pct >= 75) return COLORS.success;
  if (pct >= 50) return '#F59E0B';
  return COLORS.error;
};

function RecordItem({ item }) {
  const pct = Math.round((item.score / item.total) * 100);
  const scoreColor = getScoreColor(item.score, item.total);

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.courseIcon}>{item.courseIcon || '📘'}</Text>
      </View>
      <View style={styles.cardMiddle}>
        <Text style={styles.courseTitle} numberOfLines={1}>{item.courseTitle}</Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <View style={styles.diffPill}>
          <Text style={styles.diffText}>{item.difficulty}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}/{item.total}</Text>
        <Text style={[styles.pctText, { color: scoreColor }]}>{pct}%</Text>
      </View>
    </View>
  );
}

export default function TrackRecordsScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const data = await fetchQuizRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  // Reloads every time this screen comes into focus (e.g. after a new quiz)
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Records</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : records.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Quizzes Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your quiz history will show up here once you complete one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RecordItem item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 60, paddingVertical: 6 },
  backText: { ...FONTS.medium, color: COLORS.primary, fontSize: 14 },
  headerTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text },
  list: { padding: 16, paddingBottom: 30 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.cardBorder, padding: 14, marginBottom: 12, alignItems: 'center',
  },
  cardLeft: {
    width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  courseIcon: { fontSize: 22 },
  cardMiddle: { flex: 1 },
  courseTitle: { ...FONTS.semibold, fontSize: 14.5, color: COLORS.text, marginBottom: 4 },
  dateText: { ...FONTS.regular, fontSize: 11.5, color: COLORS.textSecondary, marginBottom: 6 },
  diffPill: {
    backgroundColor: COLORS.primaryMuted, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start',
  },
  diffText: { ...FONTS.medium, fontSize: 10, color: COLORS.primary },
  cardRight: { alignItems: 'flex-end', marginLeft: 8 },
  scoreText: { ...FONTS.heavy, fontSize: 17 },
  pctText: { ...FONTS.medium, fontSize: 11, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 6 },
  emptySubtitle: {
    ...FONTS.regular, fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 19,
  },
});