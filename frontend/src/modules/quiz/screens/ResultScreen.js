import React, { useState } from 'react';
import { useEffect } from 'react';
import { saveQuizRecord } from '../../records/services/records.service';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar,
} from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import QuizQuestion from '../components/QuizQuestion';

const getGrade = (pct) => {
  if (pct >= 90) return { label: 'Excellent! 🏆', color: '#FFD700' };
  if (pct >= 75) return { label: 'Great Job! 🎉',  color: COLORS.success };
  if (pct >= 60) return { label: 'Good Work! 👍',  color: '#3B82F6' };
  if (pct >= 40) return { label: 'Keep Trying! 💪', color: '#F59E0B' };
  return              { label: 'Needs Practice 📖', color: COLORS.error };
};

export default function ResultScreen({ navigation, route }) {
  const { score, total, questions, answers, course, difficulty } = route.params;
  useEffect(() => {
  saveQuizRecord({
    courseTitle: course.title,
    courseIcon: course.icon,
    difficulty,
    score,
    total,
  });
}, []);
  const [showReview, setShowReview] = useState(false);

  const percentage = Math.round((score / total) * 100);
  const grade      = getGrade(percentage);
  const wrong      = total - score;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreCourse}>{course.icon}  {course.title}</Text>
          <Text style={styles.scoreDiff}>{difficulty}</Text>

          {/* Circular score display */}
          <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
            <Text style={[styles.scoreNumber, { color: grade.color }]}>{score}</Text>
            <Text style={styles.scoreTotal}>/{total}</Text>
          </View>

          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.percentText}>{percentage}% Correct</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { borderColor: COLORS.success }]}>
              <Text style={[styles.statNum, { color: COLORS.success }]}>{score}</Text>
              <Text style={styles.statLabel}>Correct ✓</Text>
            </View>
            <View style={[styles.statBox, { borderColor: COLORS.error }]}>
              <Text style={[styles.statNum, { color: COLORS.error }]}>{wrong}</Text>
              <Text style={styles.statLabel}>Wrong ✗</Text>
            </View>
            <View style={[styles.statBox, { borderColor: COLORS.textMuted }]}>
              <Text style={[styles.statNum, { color: COLORS.text }]}>{total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => setShowReview(v => !v)}
        >
          <Text style={styles.reviewBtnText}>
            {showReview ? '▲ Hide Review' : '▼ Review Answers'}
          </Text>
        </TouchableOpacity>

        {/* Answer review */}
        {showReview && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Answer Review</Text>
            {questions.map((q, i) => (
              <View key={q.id} style={styles.reviewItem}>
                <QuizQuestion
                  question={q}
                  questionIndex={i}
                  totalQuestions={total}
                  selectedOption={answers[q.id] ?? null}
                  onSelect={() => {}}
                  isReviewing={true}
                />
                {answers[q.id] !== q.answer && (
                  <View style={styles.correctHint}>
                    <Text style={styles.correctHintText}>
                      ✓ Correct: {q.options[q.answer]}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Dashboard button */}
        <TouchableOpacity
          style={styles.dashBtn}
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.85}
        >
          <Text style={styles.dashBtnText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.retryBtnText}>↺ Retry Same Setup</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll:    { padding: 20, paddingTop: 60, paddingBottom: 40 },

  scoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCourse: { ...FONTS.bold,    fontSize: 17, color: COLORS.text,          marginBottom: 4 },
  scoreDiff:   { ...FONTS.medium,  fontSize: 13, color: COLORS.textSecondary, marginBottom: 28 },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.card,
  },
  scoreNumber: { ...FONTS.heavy,   fontSize: 48, lineHeight: 52 },
  scoreTotal:  { ...FONTS.bold,    fontSize: 18, color: COLORS.textSecondary },
  gradeLabel:  { ...FONTS.heavy,   fontSize: 22, marginBottom: 4 },
  percentText: { ...FONTS.medium,  fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  statsRow:    { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  statNum:   { ...FONTS.heavy,  fontSize: 24, marginBottom: 2 },
  statLabel: { ...FONTS.medium, fontSize: 11, color: COLORS.textSecondary },

  reviewBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewBtnText:  { ...FONTS.semibold, color: COLORS.textSecondary, fontSize: 14 },
  reviewSection:  { marginBottom: 16 },
  reviewTitle:    { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 14 },
  reviewItem:     { marginBottom: 24 },
  correctHint: {
    backgroundColor: COLORS.successMuted,
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  correctHintText:{ ...FONTS.semibold, color: COLORS.success, fontSize: 13 },

  dashBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dashBtnText:  { ...FONTS.bold,    color: COLORS.white,         fontSize: 16 },
  retryBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryBtnText: { ...FONTS.semibold, color: COLORS.textSecondary, fontSize: 14 },
});