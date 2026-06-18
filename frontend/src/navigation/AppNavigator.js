import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ── Auth
import SplashScreen from '../modules/auth/screens/SplashScreen';
import LoginScreen  from '../modules/auth/screens/LoginScreen';
import SignupScreen from '../modules/auth/screens/SignupScreen';

// ── Courses
import DashboardScreen from '../modules/courses/screens/DashboardScreen';

// ── Quiz
import QuizSetupScreen   from '../modules/quiz/screens/QuizSetupScreen';
import QuizAttemptScreen from '../modules/quiz/screens/QuizAttemptScreen';
import ResultScreen      from '../modules/quiz/screens/ResultScreen';

// ── Records
import TrackRecordsScreen from '../modules/records/screens/TrackRecordsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* Splash — always first, decides where to go */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Auth */}
        <Stack.Screen name="Login"  component={LoginScreen}  />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Courses */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Records */}
        <Stack.Screen name="TrackRecords" component={TrackRecordsScreen} />

        {/* Quiz */}
        <Stack.Screen name="QuizSetup"   component={QuizSetupScreen}   />
        <Stack.Screen name="QuizAttempt" component={QuizAttemptScreen} />
        <Stack.Screen name="Result"      component={ResultScreen}      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}