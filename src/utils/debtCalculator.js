/**
 * Calculates net debts between trip participants based on expenses.
 *
 * For each expense:
 *   - paidBy person paid the full amount
 *   - each person in splitBetween owes (amount / splitBetween.length)
 *
 * Returns an array of simplified transactions: { from, to, amount }
 */
export function calculateDebts(expenses, settlements = []) {
  // balance[person] = net amount (positive = owed money, negative = owes money)
  const balance = {};

  for (const expense of expenses) {
    const { amount, paidBy, splitBetween } = expense;
    if (!splitBetween || splitBetween.length === 0) continue;

    const share = amount / splitBetween.length;

    // paidBy receives share from everyone in splitBetween
    balance[paidBy] = (balance[paidBy] || 0) + amount;

    for (const person of splitBetween) {
      balance[person] = (balance[person] || 0) - share;
    }
  }

  // Apply settlements
  for (const s of settlements) {
    balance[s.from] = (balance[s.from] || 0) + s.amount;
    balance[s.to] = (balance[s.to] || 0) - s.amount;
  }

  // Simplify: use greedy algorithm to minimize transactions
  const creditors = []; // people who are owed money (positive balance)
  const debtors = [];   // people who owe money (negative balance)

  for (const [person, bal] of Object.entries(balance)) {
    if (Math.abs(bal) < 0.01) continue; // ignore rounding noise
    if (bal > 0) creditors.push({ person, amount: bal });
    else debtors.push({ person, amount: -bal });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci];
    const debt = debtors[di];
    const paid = Math.min(credit.amount, debt.amount);

    transactions.push({
      from: debt.person,
      to: credit.person,
      amount: Math.round(paid * 100) / 100,
    });

    credit.amount -= paid;
    debt.amount -= paid;

    if (credit.amount < 0.01) ci++;
    if (debt.amount < 0.01) di++;
  }

  return transactions;
}

/**
 * Returns total spent per participant across all expenses.
 */
export function spendingPerPerson(expenses) {
  const totals = {};
  for (const expense of expenses) {
    const { amount, paidBy } = expense;
    totals[paidBy] = (totals[paidBy] || 0) + amount;
  }
  return totals;
}

/**
 * Returns total spent per category.
 */
export function spendingPerCategory(expenses) {
  const totals = {};
  for (const expense of expenses) {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  }
  return totals;
}

export const CATEGORIES = [
  { label: 'Transport', icon: 'airplane', color: '#4A90D9' },
  { label: 'Accommodation', icon: 'bed', color: '#7B68EE' },
  { label: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { label: 'Entertainment', icon: 'musical-notes', color: '#FFD700' },
  { label: 'Shopping', icon: 'cart', color: '#FF8C00' },
  { label: 'Health', icon: 'medkit', color: '#32CD32' },
  { label: 'Other', icon: 'ellipsis-horizontal', color: '#A9A9A9' },
];

export function getCategoryColor(categoryLabel) {
  const cat = CATEGORIES.find((c) => c.label === categoryLabel);
  return cat ? cat.color : '#A9A9A9';
}

export function getCategoryIcon(categoryLabel) {
  const cat = CATEGORIES.find((c) => c.label === categoryLabel);
  return cat ? cat.icon : 'ellipsis-horizontal';
}
