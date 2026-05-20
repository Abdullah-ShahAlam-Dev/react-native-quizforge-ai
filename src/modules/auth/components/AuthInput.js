import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity,
  Text, StyleSheet,
} from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../../theme';

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden]   = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isHidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={()  => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsHidden(p => !p)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{isHidden ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  inputRowFocused: {
    borderColor: COLORS.primary,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.text,
    fontSize: 15,
    ...FONTS.regular,
  },
  eyeBtn: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  eyeText: {
    fontSize: 16,
  },
});