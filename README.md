# TravelBudgetApp

A mobile application for managing travel budgets. Track expenses, split costs between participants, and calculate who owes what.

## Features

- **Create trips** — add a name, destination, description, currency, and participants
- **Add expenses** — record expenses with categories (Transport, Accommodation, Food, Entertainment, Shopping, Health, Other)
- **Split expenses** — assign who paid and who shares each expense
- **Debt calculation** — automatically calculate the minimum number of transactions to settle all debts
- **Mark as settled** — record payments between participants
- **Persistent storage** — all data is saved locally on the device using AsyncStorage

## Screenshots

The app includes the following screens:
- **Home** — list of all trips
- **Trip Detail** — expense list with spending breakdown by category
- **Add Trip** — form to create a trip with participants
- **Add Expense** — form to add an expense with category, payer, and split selection
- **Settle Debts** — view debts and mark payments as settled

## Tech Stack

- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) — stack navigation
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — local data persistence
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/) — Ionicons

## Requirements

- Node.js 18+
- npm or yarn
- Expo Go app on your Android/iOS device, **or** an Android/iOS emulator

## Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Artempug/TravelBudgetApp.git
cd TravelBudgetApp

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

After running `npm start`, a QR code will appear in the terminal. Scan it with the **Expo Go** app (Android/iOS) to launch the app on your phone.

### Running on Android emulator
```bash
npm run android
```

### Running on iOS simulator (macOS only)
```bash
npm run ios
```

## Project Structure

```
TravelBudgetApp/
├── App.js                        # Entry point, navigation setup
├── app.json                      # Expo configuration
├── package.json
├── src/
│   ├── context/
│   │   └── TravelContext.js      # Global state (trips, expenses) + AsyncStorage
│   ├── screens/
│   │   ├── HomeScreen.js         # List of trips
│   │   ├── AddTripScreen.js      # Create a new trip
│   │   ├── TripDetailScreen.js   # Trip expenses and summary
│   │   ├── AddExpenseScreen.js   # Add an expense
│   │   └── DebtScreen.js        # Debt calculation and settlement
│   ├── components/
│   │   ├── TripCard.js           # Trip list item component
│   │   └── ExpenseCard.js        # Expense list item component
│   └── utils/
│       └── debtCalculator.js     # Debt calculation algorithm
└── assets/
```

## Debt Calculation Algorithm

The app uses a **greedy balance algorithm** to minimize the number of transactions needed to settle all debts:

1. For each expense, the payer is credited the full amount and each person in "split between" is debited their equal share.
2. Net balances are calculated per participant.
3. Creditors (positive balance) and debtors (negative balance) are sorted by amount.
4. Greedy matching minimizes the number of transactions.

## License

MIT
