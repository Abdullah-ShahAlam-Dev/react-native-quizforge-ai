import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import NetworkBanner from './src/components/NetworkBanner';

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigator />
      <NetworkBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});