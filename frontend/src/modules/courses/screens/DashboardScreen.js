import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import CourseCard     from '../components/CourseCard';
import { fetchCourses } from '../services/course.service';

export default function DashboardScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [data, name] = await Promise.all([
          fetchCourses(),
          AsyncStorage.getItem('userName'),
        ]);
        setCourses(data);
        setUserName(name || 'Student');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userName']);
    navigation.replace('Login');
  };

  const handleCoursePress = (course) => {
    navigation.navigate('QuizSetup', { course });
  };

  const renderItem = ({ index }) => {
    if (index % 2 !== 0) return null;
    const left  = courses[index];
    const right = courses[index + 1];
    return (
      <View style={styles.row}>
        <CourseCard course={left} onPress={handleCoursePress} />
        {right
          ? <CourseCard course={right} onPress={handleCoursePress} />
          : <View style={styles.placeholder} />
        }
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {userName?.trim().split(' ')[0] || 'Student'} 👋</Text>
          <Text style={styles.subGreeting}>Pick a course to start a quiz</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* ── Track Records Banner ── */}
      <TouchableOpacity
        style={styles.recordsBanner}
        onPress={() => navigation.navigate('TrackRecords')}
        activeOpacity={0.8}
      >
        <View style={styles.recordsIconBubble}>
          <Text style={styles.recordsIcon}>📊</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.recordsTitle}>Track Records</Text>
          <Text style={styles.recordsSubtitle}>View your past quiz attempts & scores</Text>
        </View>
        <Text style={styles.recordsArrow}>→</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚡ Courses</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{courses.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  greeting:     { ...FONTS.heavy, fontSize: 22, color: COLORS.text },
  subGreeting:  { ...FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  logoutBtn: {
    backgroundColor: COLORS.primaryMuted, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.primary,
  },
  logoutText: { ...FONTS.semibold, color: COLORS.primary, fontSize: 13 },

  recordsBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: 14, marginHorizontal: 20, marginTop: 16, gap: 12,
  },
  recordsIconBubble: {
    width: 42, height: 42, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  recordsIcon: { fontSize: 20 },
  recordsTitle: { ...FONTS.bold, fontSize: 14.5, color: COLORS.text, marginBottom: 2 },
  recordsSubtitle: { ...FONTS.regular, fontSize: 11.5, color: COLORS.textSecondary },
  recordsArrow: { color: COLORS.textMuted, fontSize: 16 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text, marginRight: 8 },
  badge: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
  },
  badgeText:  { ...FONTS.bold, fontSize: 11, color: COLORS.white },
  list:       { paddingHorizontal: 14, paddingBottom: 30 },
  row:        { flexDirection: 'row' },
  placeholder:{ flex: 1, margin: 6 },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:{ color: COLORS.textSecondary, fontSize: 14 },
});