import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@travel_budget_trips';

const TravelContext = createContext(null);

const initialState = {
  trips: [],
  loading: true,
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TRIPS':
      return { ...state, trips: action.payload, loading: false };

    case 'ADD_TRIP': {
      const newTrip = {
        id: generateId(),
        name: action.payload.name,
        description: action.payload.description || '',
        destination: action.payload.destination || '',
        participants: action.payload.participants,
        expenses: [],
        currency: action.payload.currency || 'UAH',
        createdAt: new Date().toISOString(),
      };
      return { ...state, trips: [...state.trips, newTrip] };
    }

    case 'DELETE_TRIP':
      return { ...state, trips: state.trips.filter((t) => t.id !== action.payload) };

    case 'ADD_EXPENSE': {
      const updatedTrips = state.trips.map((trip) => {
        if (trip.id !== action.payload.tripId) return trip;
        const newExpense = {
          id: generateId(),
          title: action.payload.title,
          amount: parseFloat(action.payload.amount),
          category: action.payload.category,
          paidBy: action.payload.paidBy,
          splitBetween: action.payload.splitBetween,
          date: action.payload.date || new Date().toISOString(),
          note: action.payload.note || '',
        };
        return { ...trip, expenses: [...trip.expenses, newExpense] };
      });
      return { ...state, trips: updatedTrips };
    }

    case 'DELETE_EXPENSE': {
      const updatedTrips = state.trips.map((trip) => {
        if (trip.id !== action.payload.tripId) return trip;
        return {
          ...trip,
          expenses: trip.expenses.filter((e) => e.id !== action.payload.expenseId),
        };
      });
      return { ...state, trips: updatedTrips };
    }

    case 'MARK_SETTLED': {
      const updatedTrips = state.trips.map((trip) => {
        if (trip.id !== action.payload.tripId) return trip;
        const settlement = {
          id: generateId(),
          from: action.payload.from,
          to: action.payload.to,
          amount: action.payload.amount,
          date: new Date().toISOString(),
        };
        return { ...trip, settlements: [...(trip.settlements || []), settlement] };
      });
      return { ...state, trips: updatedTrips };
    }

    default:
      return state;
  }
}

export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveTrips(state.trips);
    }
  }, [state.trips, state.loading]);

  async function loadTrips() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'LOAD_TRIPS', payload: JSON.parse(stored) });
      } else {
        dispatch({ type: 'LOAD_TRIPS', payload: [] });
      }
    } catch {
      dispatch({ type: 'LOAD_TRIPS', payload: [] });
    }
  }

  async function saveTrips(trips) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // ignore storage errors silently
    }
  }

  function addTrip(tripData) {
    dispatch({ type: 'ADD_TRIP', payload: tripData });
  }

  function deleteTrip(tripId) {
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  }

  function addExpense(tripId, expenseData) {
    dispatch({ type: 'ADD_EXPENSE', payload: { tripId, ...expenseData } });
  }

  function deleteExpense(tripId, expenseId) {
    dispatch({ type: 'DELETE_EXPENSE', payload: { tripId, expenseId } });
  }

  function markSettled(tripId, from, to, amount) {
    dispatch({ type: 'MARK_SETTLED', payload: { tripId, from, to, amount } });
  }

  function getTripById(id) {
    return state.trips.find((t) => t.id === id);
  }

  return (
    <TravelContext.Provider
      value={{
        trips: state.trips,
        loading: state.loading,
        addTrip,
        deleteTrip,
        addExpense,
        deleteExpense,
        markSettled,
        getTripById,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be used inside TravelProvider');
  return ctx;
}
