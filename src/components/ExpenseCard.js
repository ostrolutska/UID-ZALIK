import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryColor, getCategoryIcon } from '../utils/debtCalculator';

export default function ExpenseCard({ expense, currency = 'UAH', onDelete }) {
  const categoryColor = getCategoryColor(expense.category);
  const categoryIcon = getCategoryIcon(expense.category);
  const date = new Date(expense.date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: categoryColor + '22' }]}>
        <Ionicons name={categoryIcon} size={22} color={categoryColor} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {expense.title}
        </Text>
        <Text style={styles.meta}>
          Paid by <Text style={styles.payer}>{expense.paidBy}</Text> · {date}
        </Text>
        <Text style={styles.split}>
          Split: {expense.splitBetween.join(', ')}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>
          {expense.amount.toFixed(2)} {currency}
        </Text>
        <Text style={[styles.categoryBadge, { color: categoryColor }]}>
          {expense.category}
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  payer: {
    fontWeight: '600',
    color: '#4A90D9',
  },
  split: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
});
