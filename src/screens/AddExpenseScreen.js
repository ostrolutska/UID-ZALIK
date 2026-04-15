import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTravel } from '../context/TravelContext';
import { CATEGORIES } from '../utils/debtCalculator';

export default function AddExpenseScreen({ route, navigation }) {
  const { tripId, participants, currency } = route.params;
  const { addExpense } = useTravel();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [paidBy, setPaidBy] = useState(participants[0] || '');
  const [splitBetween, setSplitBetween] = useState([...participants]);
  const [note, setNote] = useState('');

  function toggleSplitPerson(person) {
    if (splitBetween.includes(person)) {
      if (splitBetween.length === 1) {
        Alert.alert('At least one', 'At least one person must share the expense.');
        return;
      }
      setSplitBetween(splitBetween.filter((p) => p !== person));
    } else {
      setSplitBetween([...splitBetween, person]);
    }
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter an expense title.');
      return;
    }
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Required', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!paidBy) {
      Alert.alert('Required', 'Please select who paid.');
      return;
    }
    if (splitBetween.length === 0) {
      Alert.alert('Required', 'Please select at least one person to split with.');
      return;
    }

    addExpense(tripId, {
      title: title.trim(),
      amount: parsed,
      category,
      paidBy,
      splitBetween,
      note: note.trim(),
    });

    navigation.goBack();
  }

  const perPersonAmount =
    splitBetween.length > 0 && amount && !isNaN(parseFloat(amount))
      ? (parseFloat(amount.replace(',', '.')) / splitBetween.length).toFixed(2)
      : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dinner at the restaurant"
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />

        <Text style={styles.label}>Amount ({currency}) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        {perPersonAmount && (
          <Text style={styles.perPerson}>
            {perPersonAmount} {currency} per person ({splitBetween.length} people)
          </Text>
        )}

        <Text style={styles.label}>Category *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.categoryBtn,
                category === cat.label && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.label)}
            >
              <Ionicons
                name={cat.icon}
                size={18}
                color={category === cat.label ? '#fff' : cat.color}
              />
              <Text
                style={[
                  styles.categoryBtnText,
                  category === cat.label && styles.categoryBtnTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Paid By *</Text>
        <View style={styles.personGrid}>
          {participants.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.personBtn, paidBy === p && styles.personBtnActive]}
              onPress={() => setPaidBy(p)}
            >
              <View style={[styles.personAvatar, paidBy === p && styles.personAvatarActive]}>
                <Text style={styles.personAvatarText}>{p.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={[styles.personName, paidBy === p && styles.personNameActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Split Between *</Text>
        <View style={styles.personGrid}>
          {participants.map((p) => {
            const selected = splitBetween.includes(p);
            return (
              <TouchableOpacity
                key={p}
                style={[styles.personBtn, selected && styles.personBtnSelected]}
                onPress={() => toggleSplitPerson(p)}
              >
                <View style={[styles.personAvatar, selected && styles.personAvatarSelected]}>
                  <Text style={styles.personAvatarText}>{p.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={[styles.personName, selected && styles.personNameSelected]}>
                  {p}
                </Text>
                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#4A90D9"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional notes..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={2}
          maxLength={200}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>Save Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  perPerson: {
    fontSize: 12,
    color: '#4A90D9',
    fontWeight: '500',
    marginTop: 4,
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    backgroundColor: '#fff',
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  categoryBtnTextActive: {
    color: '#fff',
  },
  personGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    backgroundColor: '#fff',
  },
  personBtnActive: {
    borderColor: '#4A90D9',
    backgroundColor: '#EBF4FF',
  },
  personBtnSelected: {
    borderColor: '#4A90D9',
    backgroundColor: '#EBF4FF',
  },
  personAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personAvatarActive: {
    backgroundColor: '#4A90D9',
  },
  personAvatarSelected: {
    backgroundColor: '#4A90D9',
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  personName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  personNameActive: {
    color: '#4A90D9',
    fontWeight: '600',
  },
  personNameSelected: {
    color: '#4A90D9',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    gap: 8,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
