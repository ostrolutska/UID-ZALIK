import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// state: 'default' | 'correct' | 'wrong' | 'disabled'
export default function AnswerButton({ label, index, state = 'default', onPress }) {
  const letters = ['A', 'B', 'C', 'D'];

  const containerStyle = [
    styles.container,
    state === 'correct' && styles.correct,
    state === 'wrong' && styles.wrong,
    state === 'disabled' && styles.disabled,
  ];

  const letterStyle = [
    styles.letter,
    state === 'correct' && styles.letterActive,
    state === 'wrong' && styles.letterWrong,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={state !== 'default'}
      activeOpacity={0.75}
    >
      <View style={[styles.letterBadge,
        state === 'correct' && styles.letterBadgeCorrect,
        state === 'wrong' && styles.letterBadgeWrong,
      ]}>
        <Text style={letterStyle}>{letters[index]}</Text>
      </View>
      <Text style={[styles.label,
        state === 'correct' && styles.labelCorrect,
        state === 'wrong' && styles.labelWrong,
      ]} numberOfLines={2}>
        {label}
      </Text>
      {state === 'correct' && (
        <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
      )}
      {state === 'wrong' && (
        <Ionicons name="close-circle" size={22} color="#F44336" />
      )}
    </TouchableOpacity>
  );
}

import { View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8E8F0',
    gap: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  correct: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1FBF1',
  },
  wrong: {
    borderColor: '#F44336',
    backgroundColor: '#FFF1F1',
  },
  disabled: {
    opacity: 0.5,
  },
  letterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterBadgeCorrect: {
    backgroundColor: '#4CAF50',
  },
  letterBadgeWrong: {
    backgroundColor: '#F44336',
  },
  letter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
  letterActive: {
    color: '#fff',
  },
  letterWrong: {
    color: '#fff',
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#2D2D3A',
    fontWeight: '500',
  },
  labelCorrect: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  labelWrong: {
    color: '#C62828',
  },
});
