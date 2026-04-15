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

const CURRENCIES = ['UAH', 'USD', 'EUR', 'GBP', 'PLN'];

export default function AddTripScreen({ navigation }) {
  const { addTrip } = useTravel();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('UAH');
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState([]);

  function addParticipant() {
    const trimmed = participantInput.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) {
      Alert.alert('Duplicate', `"${trimmed}" is already in the list.`);
      return;
    }
    setParticipants([...participants, trimmed]);
    setParticipantInput('');
  }

  function removeParticipant(name) {
    setParticipants(participants.filter((p) => p !== name));
  }

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a trip name.');
      return;
    }
    if (participants.length < 1) {
      Alert.alert('Required', 'Add at least one participant.');
      return;
    }

    addTrip({
      name: name.trim(),
      destination: destination.trim(),
      description: description.trim(),
      currency,
      participants,
    });

    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Trip Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Summer Europe Trip"
          value={name}
          onChangeText={setName}
          maxLength={60}
        />

        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Paris, France"
          value={destination}
          onChangeText={setDestination}
          maxLength={80}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Optional notes about the trip..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        <Text style={styles.label}>Currency</Text>
        <View style={styles.currencyRow}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.currencyBtn, currency === c && styles.currencyBtnActive]}
              onPress={() => setCurrency(c)}
            >
              <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Participants *</Text>
        <View style={styles.participantInputRow}>
          <TextInput
            style={[styles.input, styles.participantInput]}
            placeholder="Enter name and press Add"
            value={participantInput}
            onChangeText={setParticipantInput}
            onSubmitEditing={addParticipant}
            returnKeyType="done"
            maxLength={40}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addParticipant}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {participants.length > 0 && (
          <View style={styles.chipContainer}>
            {participants.map((p) => (
              <View key={p} style={styles.chip}>
                <Text style={styles.chipText}>{p}</Text>
                <TouchableOpacity onPress={() => removeParticipant(p)} style={styles.chipRemove}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.createBtnText}>Create Trip</Text>
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
    height: 80,
    textAlignVertical: 'top',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  currencyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    backgroundColor: '#fff',
  },
  currencyBtnActive: {
    borderColor: '#4A90D9',
    backgroundColor: '#4A90D9',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  currencyTextActive: {
    color: '#fff',
  },
  participantInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  participantInput: {
    flex: 1,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90D9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  chipRemove: {
    marginLeft: 2,
  },
  createBtn: {
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
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
