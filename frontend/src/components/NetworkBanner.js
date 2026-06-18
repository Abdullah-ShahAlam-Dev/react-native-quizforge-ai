import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS, FONTS } from '../theme';

export default function NetworkBanner() {
  const [status, setStatus] = useState('online'); // 'online' | 'offline' | 'reconnected'
  const opacity = useRef(new Animated.Value(0)).current;
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable !== false;

      if (!isOnline) {
        wasOffline.current = true;
        setStatus('offline');
        fadeIn();
      } else if (wasOffline.current) {
        wasOffline.current = false;
        setStatus('reconnected');
        fadeIn();
        setTimeout(fadeOut, 2500); // green banner auto-hides after 2.5s
      } else {
        fadeOut();
      }
    });
    return () => unsubscribe();
  }, []);

  const fadeIn  = () => Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  const fadeOut = () => Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start();

  const isOffline = status === 'offline';

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.banner, { backgroundColor: isOffline ? COLORS.error : COLORS.success, opacity }]}
    >
      <Text style={styles.text}>
        {isOffline ? '🔴  No Internet — Showing Offline Data' : '🟢  Back Online'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  text: { ...FONTS.semibold, color: '#FFFFFF', fontSize: 12.5 },
});