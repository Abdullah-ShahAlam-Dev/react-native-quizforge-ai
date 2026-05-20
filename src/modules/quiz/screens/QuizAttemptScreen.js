import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, StatusBar,
} from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import QuizQuestion from '../components/QuizQuestion';

export default function QuizAttemptScreen({ navigation, route }) {
  const { questions, course, difficulty } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({}); // { questionId: selectedOptionIndex }

  const currentQ   = questions[currentIndex];
  const isLastQ    = currentIndex === questions.length - 1;
  const isFirstQ   = currentIndex === 0;
  const hasAnswered = answers[currentQ.id] !== undefined;

  const handleSelect = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleNext = () => {
    if (!hasAnswered) {
      Alert.alert('No Answer', 'Please select an option before proceeding.');
      return;
    }
    if (isLastQ) {
      handleSubmit();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

const handleSubmit = () => {
  Alert.alert('Submit Quiz?', 'Are you sure you want to submit your answers?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Submit',
      style: 'destructive',
      onPress: () => {
        const score = questions.reduce((acc, q) => {
          return answers[q.id] === q.answer ? acc + 1 : acc;
        }, 0);
        navigation.replace('Result', {
          score,
          total: questions.length,
          questions,
          answers,
          course,
          difficulty,
        });
      },
    },
  ]);
};


  const answeredCount = Object.keys(answers).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerCourse}>{course.icon} {course.title}</Text>
          <Text style={styles.headerDiff}>{difficulty}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.scoreTracker}>{answeredCount}/{questions.length}</Text>
          <Text style={styles.scoreLabel}>Answered</Text>
        </View>
      </View>

      {/* Question */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuizQuestion
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          selectedOption={answers[currentQ.id] ?? null}
          onSelect={handleSelect}
          isReviewing={false}
        />
      </ScrollView>

      {/* Footer nav */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, isFirstQ && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(i => i - 1)}
          disabled={isFirstQ}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.dotRow}>
          {questions.map((q, i) => (
            <TouchableOpacity key={q.id} onPress={() => setCurrentIndex(i)}>
              <View style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
                answers[q.id] !== undefined && styles.dotAnswered,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnPrimary, !hasAnswered && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={!hasAnswered}
        >
          <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>
            {isLastQ ? 'Submit ✓' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerCourse: { ...FONTS.bold,    fontSize: 15, color: COLORS.text       },
  headerDiff:   { ...FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  headerRight:  { alignItems: 'center' },
  scoreTracker: { ...FONTS.heavy,   fontSize: 22, color: COLORS.primary    },
  scoreLabel:   { ...FONTS.regular, fontSize: 11, color: COLORS.textSecondary },
  scroll:       { flex: 1 },
  scrollContent:{ padding: 20, paddingBottom: 30 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
       paddingBottom: 60, 
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: 'center',
  },
  navBtnPrimary:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  navBtnDisabled:    { opacity: 0.35 },
  navBtnText:        { ...FONTS.semibold, color: COLORS.textSecondary, fontSize: 13 },
  navBtnTextPrimary: { color: COLORS.white },
  dotRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', flex: 1, justifyContent: 'center', marginHorizontal: 8 },
  dot: {
    width: 8, height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  dotActive:   { backgroundColor: COLORS.primary, width: 20 },
  dotAnswered: { backgroundColor: COLORS.success  },
});