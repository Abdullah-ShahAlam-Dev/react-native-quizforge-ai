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

  const renderItem = ({ item, index }) => {
    // Build pairs for 2-column grid manually
    if (index % 2 !== 0) return null; // skip odd — rendered by even
    const left  = courses[index];
    const right = courses[index + 1];
    return (
      <View style={styles.row}>
        <CourseCard course={left}  onPress={handleCoursePress} />
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

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName} 👋</Text>
          <Text style={styles.subGreeting}>Pick a course to start a quiz</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* ── Section title ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚡ Courses</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{courses.length}</Text>
        </View>
      </View>

      {/* ── Grid ── */}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting:     { ...FONTS.heavy, fontSize: 22, color: COLORS.text },
  subGreeting:  { ...FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  logoutBtn: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logoutText:  { ...FONTS.semibold, color: COLORS.primary, fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: { ...FONTS.bold, fontSize: 17, color: COLORS.text, marginRight: 8 },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText:  { ...FONTS.bold, fontSize: 11, color: COLORS.white },
  list:       { paddingHorizontal: 14, paddingBottom: 30 },
  row:        { flexDirection: 'row', marginBottom: 0 },
  placeholder:{ flex: 1, margin: 6 },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:{ color: COLORS.textSecondary, fontSize: 14 },
});