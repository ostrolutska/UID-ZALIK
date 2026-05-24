import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuiz } from '../context/QuizContext';

export default function ResultScreen({ navigation }) {
  const { answers, score, highScore, maxScore, totalQuestions, restartQuiz } = useQuiz();

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / maxScore) * 100);

  const { emoji, message, color } = getResultFeedback(correctCount, totalQuestions);

  function handleRestart() {
    restartQuiz();
    navigation.replace('Quiz');
  }

  function handleHome() {
    restartQuiz();
    navigation.replace('Home');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score header */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreMax}>/ {maxScore} балів</Text>
          </View>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard icon="checkmark-circle" color="#4CAF50" value={correctCount} label="Правильно" />
          <StatCard icon="close-circle" color="#F44336" value={totalQuestions - correctCount} label="Неправильно" />
          <StatCard icon="trophy" color="#FFD700" value={highScore} label="Рекорд" />
        </View>

        {/* New high score banner */}
        {score >= highScore && highScore > 0 && score > 0 && (
          <View style={styles.newRecordBanner}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.newRecordText}>Новий рекорд!</Text>
          </View>
        )}

        {/* Question breakdown */}
        <Text style={styles.breakdownTitle}>Детальний результат</Text>
        {answers.map((ans, i) => (
          <View key={i} style={[styles.answerRow,
            ans.isCorrect ? styles.answerRowCorrect : styles.answerRowWrong]}>
            <View style={[styles.answerIcon,
              ans.isCorrect ? styles.iconCorrect : styles.iconWrong]}>
              <Ionicons
                name={ans.isCorrect ? 'checkmark' : 'close'}
                size={16}
                color="#fff"
              />
            </View>
            <View style={styles.answerInfo}>
              <Text style={styles.answerQuestion} numberOfLines={2}>
                {i + 1}. {ans.question}
              </Text>
              <Text style={[styles.answerDetail,
                ans.isCorrect ? styles.detailCorrect : styles.detailWrong]}>
                {ans.isCorrect
                  ? `Правильно · +${ans.points} балів`
                  : ans.selected === null
                  ? 'Час вийшов · 0 балів'
                  : 'Неправильно · 0 балів'}
              </Text>
            </View>
          </View>
        ))}

        {/* Action buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.85}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.restartBtnText}>Грати знову</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={handleHome} activeOpacity={0.85}>
            <Ionicons name="home-outline" size={20} color="#6C63FF" />
            <Text style={styles.homeBtnText}>На головну</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={26} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getResultFeedback(correct, total) {
  const ratio = correct / total;
  if (ratio === 1)   return { emoji: '🏆', message: 'Ідеальний результат!', color: '#4CAF50' };
  if (ratio >= 0.8)  return { emoji: '🎉', message: 'Чудово!',              color: '#6C63FF' };
  if (ratio >= 0.6)  return { emoji: '👍', message: 'Непогано!',            color: '#2196F3' };
  if (ratio >= 0.4)  return { emoji: '😐', message: 'Можна краще',          color: '#FF9800' };
  return               { emoji: '😔', message: 'Спробуй ще раз',          color: '#F44336' };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F4FF' },
  scroll: { paddingBottom: 30 },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: -10,
  },
  emoji: { fontSize: 52 },
  message: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 4,
  },
  scoreValue: { fontSize: 40, fontWeight: '900', color: '#fff' },
  scoreMax: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  percentage: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#2D2D3A', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  newRecordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  newRecordText: { fontSize: 15, fontWeight: '700', color: '#B8860B' },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D3A',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  answerRowCorrect: { backgroundColor: '#F1FBF1', borderLeftWidth: 3, borderLeftColor: '#4CAF50' },
  answerRowWrong:   { backgroundColor: '#FFF1F1', borderLeftWidth: 3, borderLeftColor: '#F44336' },
  answerIcon: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  iconCorrect: { backgroundColor: '#4CAF50' },
  iconWrong:   { backgroundColor: '#F44336' },
  answerInfo: { flex: 1 },
  answerQuestion: { fontSize: 13, color: '#2D2D3A', fontWeight: '600', lineHeight: 18 },
  answerDetail: { fontSize: 12, marginTop: 3, fontWeight: '500' },
  detailCorrect: { color: '#2E7D32' },
  detailWrong:   { color: '#C62828' },
  buttons: { marginHorizontal: 16, marginTop: 20, gap: 10 },
  restartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#6C63FF', borderRadius: 14, paddingVertical: 15, gap: 8,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  restartBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 14, paddingVertical: 15, gap: 8,
    borderWidth: 2, borderColor: '#6C63FF',
  },
  homeBtnText: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
});
