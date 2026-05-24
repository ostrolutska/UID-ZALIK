import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuiz } from '../context/QuizContext';

export default function HomeScreen({ navigation }) {
  const { highScore, totalQuestions, maxScore, restartQuiz } = useQuiz();

  function handleStart() {
    restartQuiz();
    navigation.navigate('Quiz');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="help-circle" size={64} color="#fff" />
          </View>
          <Text style={styles.title}>Quiz App</Text>
          <Text style={styles.subtitle}>Перевір свої знання!</Text>
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="list-outline" size={28} color="#6C63FF" />
            <Text style={styles.infoValue}>{totalQuestions}</Text>
            <Text style={styles.infoLabel}>Питань</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="timer-outline" size={28} color="#6C63FF" />
            <Text style={styles.infoValue}>15с</Text>
            <Text style={styles.infoLabel}>На питання</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="star-outline" size={28} color="#6C63FF" />
            <Text style={styles.infoValue}>{maxScore}</Text>
            <Text style={styles.infoLabel}>Макс. балів</Text>
          </View>
        </View>

        {/* High score */}
        {highScore > 0 && (
          <View style={styles.highScoreCard}>
            <Ionicons name="trophy" size={22} color="#FFD700" />
            <Text style={styles.highScoreText}>Рекорд: {highScore} балів</Text>
          </View>
        )}

        {/* Rules */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Правила гри</Text>
          <RuleItem icon="checkmark-circle-outline" text="10 запитань із загальних знань" />
          <RuleItem icon="time-outline" text="15 секунд на кожне питання" />
          <RuleItem icon="flash-outline" text="+10 балів за правильну відповідь" />
          <RuleItem icon="speedometer-outline" text="Бонус за швидкість: до +15 балів" />
          <RuleItem icon="close-circle-outline" text="Час вийшов — відповідь зарахована як неправильна" />
        </View>

        {/* Start button */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Ionicons name="play" size={24} color="#fff" />
          <Text style={styles.startBtnText}>Почати вікторину</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function RuleItem({ icon, text }) {
  return (
    <View style={styles.ruleItem}>
      <Ionicons name={icon} size={18} color="#6C63FF" />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#6C63FF' },
  container: { flex: 1, backgroundColor: '#F4F4FF' },
  header: {
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: -20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoValue: { fontSize: 20, fontWeight: '800', color: '#2D2D3A', marginTop: 4 },
  infoLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  highScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  highScoreText: { fontSize: 15, fontWeight: '700', color: '#B8860B' },
  rulesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rulesTitle: { fontSize: 15, fontWeight: '700', color: '#2D2D3A', marginBottom: 10 },
  ruleItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  ruleText: { fontSize: 13, color: '#555', flex: 1 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 16,
    gap: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});
