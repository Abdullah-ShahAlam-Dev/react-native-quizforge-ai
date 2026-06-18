import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';

export default function QuizQuestion({
  question,      // { question, options, answer, id }
  questionIndex, // 0-based
  totalQuestions,
  selectedOption,// index of selected option or null
  onSelect,      // (optionIndex) => void
  isReviewing,   // true on ResultScreen review mode
}) {
  const getOptionStyle = (index) => {
    if (!isReviewing) {
      return selectedOption === index ? styles.optionSelected : styles.option;
    }
    // Review mode: show correct/wrong
    if (index === question.answer)   return styles.optionCorrect;
    if (index === selectedOption && selectedOption !== question.answer) return styles.optionWrong;
    return styles.option;
  };

  const getOptionTextStyle = (index) => {
    if (!isReviewing) {
      return selectedOption === index ? styles.optionTextSelected : styles.optionText;
    }
    if (index === question.answer)   return styles.optionTextCorrect;
    if (index === selectedOption && selectedOption !== question.answer) return styles.optionTextWrong;
    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Question {questionIndex + 1} of {totalQuestions}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((questionIndex + 1) / totalQuestions) * 100}%` }]} />
        </View>
      </View>

      {/* Question text */}
      <View style={styles.questionCard}>
        <Text style={styles.qNumber}>Q{questionIndex + 1}</Text>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => !isReviewing && onSelect(index)}
            activeOpacity={0.75}
            disabled={isReviewing}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.letterText}>{['A', 'B', 'C', 'D'][index]}</Text>
            </View>
            <Text style={getOptionTextStyle(index)} numberOfLines={3}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressRow: {
    marginBottom: 20,
  },
  progressLabel: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'right',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 20,
  },
  qNumber: {
    ...FONTS.bold,
    color: COLORS.primary,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  questionText: {
    ...FONTS.semibold,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  optionsContainer: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
    gap: 12,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 14,
    gap: 12,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successMuted,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.success,
    padding: 14,
    gap: 12,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF525220',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    padding: 14,
    gap: 12,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText:         { ...FONTS.bold, fontSize: 12, color: COLORS.text },
  optionText:         { ...FONTS.regular, fontSize: 14, color: COLORS.text, flex: 1 },
  optionTextSelected: { ...FONTS.semibold, fontSize: 14, color: COLORS.primary, flex: 1 },
  optionTextCorrect:  { ...FONTS.semibold, fontSize: 14, color: COLORS.success, flex: 1 },
  optionTextWrong:    { ...FONTS.semibold, fontSize: 14, color: COLORS.error, flex: 1 },
});