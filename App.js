import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TravelProvider } from './src/context/TravelContext';
import HomeScreen from './src/screens/HomeScreen';
import AddTripScreen from './src/screens/AddTripScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import DebtScreen from './src/screens/DebtScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TravelProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#4A90D9' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Travel Budget' }}
            />
            <Stack.Screen
              name="AddTrip"
              component={AddTripScreen}
              options={{ title: 'New Trip' }}
            />
            <Stack.Screen
              name="TripDetail"
              component={TripDetailScreen}
              options={({ route }) => ({ title: route.params?.tripName || 'Trip Details' })}
            />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{ title: 'Add Expense' }}
            />
            <Stack.Screen
              name="Debts"
              component={DebtScreen}
              options={{ title: 'Settle Debts' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TravelProvider>
    </SafeAreaProvider>
  );
}
