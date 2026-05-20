import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';

// Tag → accent color mapping
const TAG_COLORS = {
  'Core CS':       '#6366F1',
  'Data':          '#F59E0B',
  'Development':   '#10B981',
  'Networking':    '#3B82F6',
  'AI/ML':         '#EC4899',
  'Hardware':      '#8B5CF6',
  'Security':      '#EF4444',
  'Infrastructure':'#06B6D4',
};

export default function CourseCard({ course, onPress }) {
  const tagColor = TAG_COLORS[course.tag] || COLORS.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course)}
      activeOpacity={0.75}
    >
      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: tagColor + '22' }]}>
        <Text style={styles.icon}>{course.icon}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{course.title}</Text>

      {/* Tag pill */}
      <View style={[styles.tag, { backgroundColor: tagColor + '22' }]}>
        <Text style={[styles.tagText, { color: tagColor }]}>{course.tag}</Text>
      </View>

      {/* Arrow indicator */}
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    flex: 1,
    margin: 6,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: { fontSize: 22 },
  title: {
    ...FONTS.semibold,
    fontSize: 13.5,
    color: COLORS.text,
    lineHeight: 19,
    marginBottom: 10,
    flex: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    ...FONTS.semibold,
    letterSpacing: 0.3,
  },
  arrow: {
    color: COLORS.textMuted,
    fontSize: 14,
    alignSelf: 'flex-end',
  },
});