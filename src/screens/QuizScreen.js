import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useQuiz } from '../context/QuizContext';
import TimerBar from '../components/TimerBar';
import AnswerButton from '../components/AnswerButton';
import ProgressDots from '../components/ProgressDots';

const TIMER_SECONDS = 15;
const NEXT_DELAY_MS = 1200; // pause after answer before moving on

export default function QuizScreen({ navigation }) {
  const { currentQuestion, currentIndex, totalQuestions, answers, submitAnswer, isFinished } =
    useQuiz();

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selectedIndex, setSelectedIndex] = useState(null); // chosen option index
  const [answered, setAnswered] = useState(false);
  const intervalRef = useRef(null);
  const submittedRef = useRef(false); // prevent double-submit

  // Navigate to result when quiz finished
  useEffect(() => {
    if (isFinished) {
      navigation.replace('Result');
    }
  }, [isFinished]);

  // Reset state for each new question
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setSelectedIndex(null);
    setAnswered(false);
    submittedRef.current = false;
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (answered) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.05) {
          clearInterval(intervalRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [answered, currentIndex]);

  function handleTimeout() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setAnswered(true);
    setSelectedIndex(null); // no selection
    setTimeout(() => submitAnswer(null, 0), NEXT_DELAY_MS);
  }

  function handleSelect(index) {
    if (answered) return;
    clearInterval(intervalRef.current);
    if (submittedRef.current) return;
    submittedRef.current = true;

    setSelectedIndex(index);
    setAnswered(true);
    setTimeout(() => submitAnswer(index, timeLeft), NEXT_DELAY_MS);
  }

  function getButtonState(index) {
    if (!answered) return 'default';
    if (index === currentQuestion.correct) return 'correct';
    if (index === selectedIndex && index !== currentQuestion.correct) return 'wrong';
    return 'disabled';
  }

  const isCorrectAnswer = selectedIndex === currentQuestion?.correct;
  const earnedPoints = answered
    ? isCorrectAnswer
      ? 10 + Math.floor(timeLeft)
      : 0
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.questionCount}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
          {answered && earnedPoints !== null && (
            <View style={[styles.pointsBadge, earnedPoints > 0 ? styles.pointsPos : styles.pointsZero]}>
              <Text style={styles.pointsText}>
                {earnedPoints > 0 ? `+${earnedPoints} балів` : 'Час вийшов!'}
              </Text>
            </View>
          )}
        </View>

        {/* Timer bar */}
        <TimerBar timeLeft={timeLeft} />

        {/* Progress dots */}
        <View style={styles.dotsWrap}>
          <ProgressDots
            total={totalQuestions}
            current={currentIndex}
            answers={answers}
          />
        </View>
      </View>

      {/* Question card */}
      <View style={styles.questionCard}>
        <View style={styles.questionNumber}>
          <Text style={styles.questionNumberText}>Питання {currentIndex + 1}</Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Answer options */}
      <View style={styles.answersContainer}>
        {currentQuestion.options.map((option, index) => (
          <AnswerButton
            key={index}
            index={index}
            label={option}
            state={getButtonState(index)}
            onPress={() => handleSelect(index)}
          />
        ))}
      </View>

      {/* Feedback banner */}
      {answered && (
        <View style={[styles.feedbackBanner,
          selectedIndex === null
            ? styles.feedbackTimeout
            : isCorrectAnswer
            ? styles.feedbackCorrect
            : styles.feedbackWrong,
        ]}>
          <Ionicons
            name={
              selectedIndex === null
                ? 'time-outline'
                : isCorrectAnswer
                ? 'checkmark-circle'
                : 'close-circle'
            }
            size={20}
            color="#fff"
          />
          <Text style={styles.feedbackText}>
            {selectedIndex === null
              ? 'Час вийшов!'
              : isCorrectAnswer
              ? `Правильно! +${earnedPoints} балів`
              : `Неправильно! Правильна: ${currentQuestion.options[currentQuestion.correct]}`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F4FF' },
  header: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '600',
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pointsPos: { backgroundColor: '#4CAF50' },
  pointsZero: { backgroundColor: '#F44336' },
  pointsText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  dotsWrap: { alignItems: 'center' },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 120,
    justifyContent: 'center',
  },
  questionNumber: {
    backgroundColor: '#EEF0FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  questionNumberText: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  questionText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2D2D3A',
    lineHeight: 26,
  },
  answersContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  feedbackCorrect: { backgroundColor: '#4CAF50' },
  feedbackWrong: { backgroundColor: '#F44336' },
  feedbackTimeout: { backgroundColor: '#FF9800' },
  feedbackText: { color: '#fff', fontWeight: '600', fontSize: 14, flexShrink: 1 },
});
