import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Modal, FlatList,
  ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import { generateQuiz } from '../services/quiz.service';

const DIFFICULTIES   = ['Basic', 'Intermediate', 'Advanced'];
const QUESTION_COUNTS = [5, 10, 15, 20];

// ── Reusable Dropdown ────────────────────────────────────────────────
function Dropdown({ label, value, options, onSelect }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={dd.wrapper}>
      <Text style={dd.label}>{label}</Text>
      <TouchableOpacity style={dd.trigger} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={dd.triggerText}>{value ?? 'Select...'}</Text>
        <Text style={dd.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={dd.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={dd.sheet}>
            <Text style={dd.sheetTitle}>{label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={String(opt)}
                style={[dd.item, value === opt && dd.itemSelected]}
                onPress={() => { onSelect(opt); setVisible(false); }}
              >
                <Text style={[dd.itemText, value === opt && dd.itemTextSelected]}>
                  {String(opt)} {value === opt ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const dd = StyleSheet.create({
  wrapper:   { marginBottom: 18 },
  label:     { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 13, marginBottom: 7, letterSpacing: 0.4 },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 50,
  },
  triggerText: { ...FONTS.regular, fontSize: 15, color: COLORS.text },
  chevron:     { color: COLORS.textSecondary, fontSize: 18 },
  overlay:     { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle:      { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 16 },
  item:            { paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemSelected:    { backgroundColor: COLORS.primaryMuted, borderRadius: RADIUS.sm, paddingHorizontal: 10 },
  itemText:        { ...FONTS.regular, fontSize: 15, color: COLORS.text },
  itemTextSelected:{ ...FONTS.semibold, color: COLORS.primary },
});

// ── Main Screen ────────────────────────────────────────────────────
export default function QuizSetupScreen({ navigation, route }) {
  const { course } = route.params;

  const [difficulty,   setDifficulty]   = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading,      setLoading]      = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateQuiz(course.title, difficulty, numQuestions);
      navigation.navigate('QuizAttempt', {
        questions: data.questions,
        course,
        difficulty,
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Setup</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Course preview */}
        <View style={styles.coursePreview}>
          <Text style={styles.courseIcon}>{course.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.coursePreviewLabel}>Selected Course</Text>
            <Text style={styles.coursePreviewTitle}>{course.title}</Text>
            <View style={styles.lockBadge}>
              <Text style={styles.lockText}>🔒 Topic locked to course</Text>
            </View>
          </View>
        </View>

        {/* Config card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configure Your Quiz</Text>

          {/* Locked topic field */}
          <View style={styles.lockedField}>
            <Text style={styles.lockedLabel}>Quiz Topic</Text>
            <View style={styles.lockedInput}>
              <Text style={styles.lockedValue}>{course.title}</Text>
              <Text style={styles.lockedIcon}>🔒</Text>
            </View>
          </View>

          <Dropdown
            label="Difficulty Level"
            value={difficulty}
            options={DIFFICULTIES}
            onSelect={setDifficulty}
          />
          <Dropdown
            label="Number of Questions"
            value={numQuestions}
            options={QUESTION_COUNTS}
            onSelect={setNumQuestions}
          />

          {/* Summary chips */}
          <View style={styles.summaryRow}>
            <View style={styles.chip}><Text style={styles.chipText}>📚 {numQuestions} Questions</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>🎯 {difficulty}</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>⚡ MCQ Format</Text></View>
          </View>
        </View>

        {/* Generate button */}
        <TouchableOpacity
          style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text style={styles.generateBtnText}>  Generating Quiz...</Text>
            </View>
          ) : (
            <Text style={styles.generateBtnText}>⚡  Generate Quiz</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingHint}>
            AI is crafting your questions. This takes a moment...
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    width: 60,
  },
  backText:    { ...FONTS.medium, color: COLORS.primary, fontSize: 14 },
  headerTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text },
  body:        { padding: 20, paddingBottom: 40 },
  coursePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 20,
    gap: 16,
  },
  courseIcon:         { fontSize: 36 },
  coursePreviewLabel: { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 11, marginBottom: 2, letterSpacing: 0.5 },
  coursePreviewTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 6 },
  lockBadge: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  lockText: { ...FONTS.medium, color: COLORS.primary, fontSize: 10 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { ...FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 20 },
  lockedField:  { marginBottom: 18 },
  lockedLabel:  { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 13, marginBottom: 7, letterSpacing: 0.4 },
  lockedInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 50,
  },
  lockedValue: { ...FONTS.regular, fontSize: 15, color: COLORS.textSecondary },
  lockedIcon:  { fontSize: 14 },
  summaryRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 12 },
  generateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  generateBtnDisabled: { opacity: 0.65 },
  generateBtnText: { ...FONTS.bold, color: COLORS.white, fontSize: 16, letterSpacing: 0.5 },
  loadingRow:  { flexDirection: 'row', alignItems: 'center' },
  loadingHint: { ...FONTS.regular, color: COLORS.textSecondary, fontSize: 13, textAlign: 'center' },
});