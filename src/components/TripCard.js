import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TripCard({ trip, onPress, onDelete }) {
  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const participantCount = trip.participants.length;
  const expenseCount = trip.expenses.length;
  const budgetProgress = trip.budget ? Math.min(totalSpent / trip.budget, 1) : null;
  const overBudget = trip.budget && totalSpent > trip.budget;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="airplane" size={24} color="#fff" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {trip.name}
          </Text>
          {trip.destination ? (
            <View style={styles.destinationRow}>
              <Ionicons name="location-outline" size={12} color="#4A90D9" />
              <Text style={styles.destination}> {trip.destination}</Text>
            </View>
          ) : null}
        </View>
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>

      {trip.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {trip.description}
        </Text>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="people-outline" size={14} color="#888" />
          <Text style={styles.statText}> {participantCount} participant{participantCount !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="receipt-outline" size={14} color="#888" />
          <Text style={styles.statText}> {expenseCount} expense{expenseCount !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.total}>
            {totalSpent.toFixed(2)} {trip.currency}
          </Text>
        </View>
      </View>

      {budgetProgress !== null && (
        <View style={styles.budgetContainer}>
          <View style={styles.budgetLabels}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={[styles.budgetAmount, overBudget && styles.overBudget]}>
              {trip.budget.toFixed(2)} {trip.currency}
              {overBudget ? ' (exceeded!)' : ''}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${budgetProgress * 100}%`,
                  backgroundColor: overBudget ? '#FF6B6B' : '#4A90D9',
                },
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  destination: {
    fontSize: 12,
    color: '#4A90D9',
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#888',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  totalLabel: {
    fontSize: 13,
    color: '#888',
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A90D9',
  },
  budgetContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: 11,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetAmount: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  overBudget: {
    color: '#FF6B6B',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
