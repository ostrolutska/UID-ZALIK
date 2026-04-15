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
import ExpenseCard from '../components/ExpenseCard';
import { spendingPerCategory, CATEGORIES } from '../utils/debtCalculator';

export default function TripDetailScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { getTripById, deleteExpense } = useTravel();
  const insets = useSafeAreaInsets();

  const trip = getTripById(tripId);

  const categoryTotals = useMemo(() => {
    if (!trip) return {};
    return spendingPerCategory(trip.expenses);
  }, [trip]);

  const totalSpent = useMemo(() => {
    if (!trip) return 0;
    return trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [trip]);

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </View>
    );
  }

  function handleDeleteExpense(expenseId, expenseTitle) {
    Alert.alert('Delete Expense', `Delete "${expenseTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpense(tripId, expenseId),
      },
    ]);
  }

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={trip.expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {totalSpent.toFixed(2)} {trip.currency}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Spent</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{trip.participants.length}</Text>
                  <Text style={styles.summaryLabel}>Participants</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{trip.expenses.length}</Text>
                  <Text style={styles.summaryLabel}>Expenses</Text>
                </View>
              </View>

              {trip.participants.length > 0 && (
                <View style={styles.participantsRow}>
                  {trip.participants.map((p) => (
                    <View key={p} style={styles.participantBadge}>
                      <Text style={styles.participantInitial}>
                        {p.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ))}
                  <Text style={styles.participantsLabel}>
                    {trip.participants.join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Category breakdown */}
            {topCategories.length > 0 && (
              <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>By Category</Text>
                <View style={styles.categoryGrid}>
                  {topCategories.map(([cat, amount]) => {
                    const catInfo = CATEGORIES.find((c) => c.label === cat);
                    return (
                      <View
                        key={cat}
                        style={[
                          styles.categoryChip,
                          { borderLeftColor: catInfo?.color || '#aaa' },
                        ]}
                      >
                        <Text style={styles.categoryChipLabel}>{cat}</Text>
                        <Text style={[styles.categoryChipAmount, { color: catInfo?.color || '#aaa' }]}>
                          {amount.toFixed(2)} {trip.currency}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.debtBtn]}
                onPress={() => navigation.navigate('Debts', { tripId })}
              >
                <Ionicons name="swap-horizontal-outline" size={18} color="#fff" />
                <Text style={styles.actionBtnText}>Settle Debts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.addExpenseBtn]}
                onPress={() =>
                  navigation.navigate('AddExpense', {
                    tripId,
                    participants: trip.participants,
                    currency: trip.currency,
                  })
                }
              >
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={styles.actionBtnText}>Add Expense</Text>
              </TouchableOpacity>
            </View>

            {trip.expenses.length > 0 && (
              <Text style={styles.sectionTitle}>Expenses</Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Add Expense" to record your first expense
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            currency={trip.currency}
            onDelete={() => handleDeleteExpense(item.id, item.title)}
          />
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#f0f0f0',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  participantBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantInitial: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  participantsLabel: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  categorySection: {
    marginBottom: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    minWidth: '47%',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryChipLabel: {
    fontSize: 12,
    color: '#888',
  },
  categoryChipAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  debtBtn: {
    backgroundColor: '#7B68EE',
  },
  addExpenseBtn: {
    backgroundColor: '#4A90D9',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
