import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, RADIUS } from '../../../theme';
import AuthInput    from '../components/AuthInput';
import { registerUser } from '../services/auth.service';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(username.trim(), email.trim(), password);
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userName',  data.user.username);
      await AsyncStorage.setItem('userId', String(data.user.id));
      navigation.replace('Dashboard');
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>🚀</Text>
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join QuizForge AI today</Text>
        </View>

        <View style={styles.card}>
          <AuthInput
            label="Username"
            placeholder="e.g. Abdullah Shah"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />
          <AuthInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AuthInput
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.btnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header:    { alignItems: 'center', marginBottom: 32 },
  iconBadge: {
    width: 72, height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  iconText:  { fontSize: 32 },
  appName:   { ...FONTS.heavy, fontSize: 26, color: COLORS.text, marginBottom: 6 },
  tagline:   { ...FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    marginBottom: 24,
  },
  btn:        { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  btnDisabled:{ opacity: 0.6 },
  btnText:    { ...FONTS.bold, color: COLORS.white, fontSize: 16, letterSpacing: 0.5 },
  footer:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  footerLink: { color: COLORS.primary, fontSize: 14, ...FONTS.semibold },
});