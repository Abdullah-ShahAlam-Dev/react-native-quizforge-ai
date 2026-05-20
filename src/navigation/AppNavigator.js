import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer }     from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';

// ── Auth
import LoginScreen  from '../modules/auth/screens/LoginScreen';
import SignupScreen from '../modules/auth/screens/SignupScreen';

// ── Courses
import DashboardScreen from '../modules/courses/screens/DashboardScreen';

// ── Quiz
import QuizSetupScreen   from '../modules/quiz/screens/QuizSetupScreen';
import QuizAttemptScreen from '../modules/quiz/screens/QuizAttemptScreen';
import ResultScreen      from '../modules/quiz/screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // On app start, check if a session token already exists.
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch {
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userToken ? 'Dashboard' : 'Login'}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* Auth */}
        <Stack.Screen name="Login"  component={LoginScreen}  />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Courses */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Quiz */}
        <Stack.Screen name="QuizSetup"   component={QuizSetupScreen}   />
        <Stack.Screen name="QuizAttempt" component={QuizAttemptScreen} />
        <Stack.Screen name="Result"      component={ResultScreen}      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}