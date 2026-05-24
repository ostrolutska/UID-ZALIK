import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressDots({ total, current, answers }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => {
        const answered = i < answers.length;
        const isCorrect = answered && answers[i]?.isCorrect;
        const isCurrent = i === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              answered && (isCorrect ? styles.dotCorrect : styles.dotWrong),
              isCurrent && styles.dotCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  dotCurrent: {
    backgroundColor: '#6C63FF',
    transform: [{ scale: 1.3 }],
  },
  dotCorrect: {
    backgroundColor: '#4CAF50',
  },
  dotWrong: {
    backgroundColor: '#F44336',
  },
});
