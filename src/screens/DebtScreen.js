import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTravel } from '../context/TravelContext';
import { calculateDebts, spendingPerPerson } from '../utils/debtCalculator';

export default function DebtScreen({ route }) {
  const { tripId } = route.params;
  const { getTripById, markSettled } = useTravel();
  const insets = useSafeAreaInsets();

  const trip = getTripById(tripId);

  const debts = useMemo(() => {
    if (!trip) return [];
    return calculateDebts(trip.expenses, trip.settlements || []);
  }, [trip]);

  const spending = useMemo(() => {
    if (!trip) return {};
    return spendingPerPerson(trip.expenses);
  }, [trip]);

  const totalSpent = useMemo(() => {
    return Object.values(spending).reduce((s, v) => s + v, 0);
  }, [spending]);

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </View>
    );
  }

  function handleSettle(debt) {
    Alert.alert(
      'Mark as Settled',
      `Mark that ${debt.from} paid ${debt.amount.toFixed(2)} ${trip.currency} to ${debt.to}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settled',
          onPress: () => markSettled(tripId, debt.from, debt.to, debt.amount),
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={debts}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Spending per person */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Spending Summary</Text>
              {trip.participants.map((p) => {
                const paid = spending[p] || 0;
                const share = totalSpent / trip.participants.length;
                const diff = paid - share;
                return (
                  <View key={p} style={styles.personRow}>
                    <View style={styles.personAvatar}>
                      <Text style={styles.personAvatarText}>{p.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{p}</Text>
                      <Text style={styles.personPaid}>
                        Paid: {paid.toFixed(2)} {trip.currency}
                      </Text>
                    </View>
                    <View style={styles.balanceContainer}>
                      <Text
                        style={[
                          styles.balance,
                          diff > 0.01
                            ? styles.balancePositive
                            : diff < -0.01
                            ? styles.balanceNegative
                            : styles.balanceNeutral,
                        ]}
                      >
                        {diff > 0.01
                          ? `+${diff.toFixed(2)}`
                          : diff < -0.01
                          ? diff.toFixed(2)
                          : '0.00'}
                      </Text>
                      <Text style={styles.balanceLabel}>
                        {diff > 0.01 ? 'to receive' : diff < -0.01 ? 'to pay' : 'settled'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>
              {debts.length > 0 ? `Transactions (${debts.length})` : 'All Settled!'}
            </Text>

            {debts.length === 0 && (
              <View style={styles.allSettledContainer}>
                <Ionicons name="checkmark-circle" size={64} color="#32CD32" />
                <Text style={styles.allSettledText}>Everyone is settled up!</Text>
                <Text style={styles.allSettledSubtext}>
                  No outstanding debts in this trip.
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.debtCard}>
            <View style={styles.debtLeft}>
              <View style={styles.debtAvatar}>
                <Text style={styles.debtAvatarText}>{item.from.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.debtFrom}>{item.from}</Text>
                <Text style={styles.debtOwes}>owes</Text>
              </View>
            </View>

            <View style={styles.debtCenter}>
              <Text style={styles.debtAmount}>
                {item.amount.toFixed(2)} {trip.currency}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#888" />
            </View>

            <View style={styles.debtRight}>
              <View style={[styles.debtAvatar, { backgroundColor: '#7B68EE' }]}>
                <Text style={styles.debtAvatarText}>{item.to.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.debtTo}>{item.to}</Text>
            </View>

            <TouchableOpacity
              style={styles.settleBtn}
              onPress={() => handleSettle(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.settleBtnText}>Settle</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  personAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  personPaid: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 1,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 15,
    fontWeight: '700',
  },
  balanceLabel: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  balancePositive: {
    color: '#32CD32',
  },
  balanceNegative: {
    color: '#FF6B6B',
  },
  balanceNeutral: {
    color: '#aaa',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  allSettledContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  allSettledText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 12,
  },
  allSettledSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 6,
  },
  debtCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  debtLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  debtAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debtAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  debtFrom: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  debtOwes: {
    fontSize: 11,
    color: '#aaa',
  },
  debtCenter: {
    alignItems: 'center',
    gap: 2,
  },
  debtAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  debtRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  debtTo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  settleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#32CD32',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 3,
  },
  settleBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
