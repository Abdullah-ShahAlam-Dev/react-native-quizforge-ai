import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import { isTokenExpired } from '../../../utils/jwtHelper';

const MIN_SPLASH_TIME = 4500; // ms — keeps the brand visible briefly even on fast devices

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      const startedAt = Date.now();
      let destination = 'Login';

      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token && !isTokenExpired(token)) {
          destination = 'Dashboard';
        } else if (token) {
          // Token exists but is expired — clean it up
          await AsyncStorage.multiRemove(['userToken', 'userName']);
        }
      } catch (e) {
        destination = 'Login';
      }

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_SPLASH_TIME - elapsed, 0);

      // Navigation only fires AFTER the async check is fully resolved —
      // this is what eliminates the race condition.
      setTimeout(() => {
        navigation.replace(destination);
      }, remaining);
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.iconBadge}>
        <Text style={styles.iconText}>⚡</Text>
      </View>
      <Text style={styles.title}>QuizForge AI</Text>
      <Text style={styles.subtitle}>Powering smarter quizzes</Text>
      <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: { fontSize: 40 },
  title: { ...FONTS.heavy, fontSize: 28, color: COLORS.text, marginBottom: 6 },
  subtitle: { ...FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 40 },
  spinner: { marginTop: 10 },
});