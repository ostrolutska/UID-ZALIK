import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import questions from '../data/questions';

const HIGH_SCORE_KEY = '@quiz_high_score';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionId, selected, correct, timeLeft }
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Load high score once on mount
  React.useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then((val) => {
      if (val) setHighScore(parseInt(val, 10));
    });
  }, []);

  // Points: correct = 10 base + timeLeft bonus (max 15), wrong = 0
  function pointsForAnswer(correct, timeLeft) {
    if (!correct) return 0;
    return 10 + Math.floor(timeLeft);
  }

  const submitAnswer = useCallback(
    async (selectedIndex, timeLeft) => {
      const question = questions[currentIndex];
      const isCorrect = selectedIndex === question.correct;
      const pts = pointsForAnswer(isCorrect, timeLeft);
      const newScore = score + pts;

      setAnswers((prev) => [
        ...prev,
        {
          questionId: question.id,
          question: question.question,
          selected: selectedIndex,
          correct: question.correct,
          isCorrect,
          points: pts,
          timeLeft,
        },
      ]);
      setScore(newScore);

      if (currentIndex + 1 >= questions.length) {
        setIsFinished(true);
        // Save high score
        if (newScore > highScore) {
          setHighScore(newScore);
          await AsyncStorage.setItem(HIGH_SCORE_KEY, String(newScore));
        }
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentIndex, score, highScore]
  );

  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setScore(0);
    setIsFinished(false);
  }, []);

  const maxScore = questions.length * 25; // 10 base + 15 max bonus

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentIndex,
        currentQuestion: questions[currentIndex],
        answers,
        score,
        highScore,
        isFinished,
        maxScore,
        totalQuestions: questions.length,
        submitAnswer,
        restartQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider');
  return ctx;
}
