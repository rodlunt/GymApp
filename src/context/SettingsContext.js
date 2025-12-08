import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const UNITS_STORAGE_KEY = '@settings_units';

export function SettingsProvider({ children }) {
  const [units, setUnits] = useState('kg'); // 'kg' or 'lbs'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedUnits = await AsyncStorage.getItem(UNITS_STORAGE_KEY);
      if (savedUnits !== null) {
        setUnits(savedUnits);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUnits = async () => {
    const newUnits = units === 'kg' ? 'lbs' : 'kg';
    setUnits(newUnits);
    try {
      await AsyncStorage.setItem(UNITS_STORAGE_KEY, newUnits);
    } catch (error) {
      console.error('Failed to save units preference:', error);
    }
  };

  // Conversion helpers
  const kgToLbs = (kg) => Math.round(kg * 2.20462 * 10) / 10;
  const lbsToKg = (lbs) => Math.round(lbs / 2.20462 * 10) / 10;

  const formatWeight = (weightInKg) => {
    if (units === 'lbs') {
      return `${kgToLbs(weightInKg)} lbs`;
    }
    return `${weightInKg} kg`;
  };

  const displayWeight = (weightInKg) => {
    if (units === 'lbs') {
      return kgToLbs(weightInKg);
    }
    return weightInKg;
  };

  const toStorageWeight = (displayValue) => {
    // Convert display value back to kg for storage
    if (units === 'lbs') {
      return lbsToKg(displayValue);
    }
    return displayValue;
  };

  const value = {
    units,
    toggleUnits,
    formatWeight,
    displayWeight,
    toStorageWeight,
    kgToLbs,
    lbsToKg,
    isLoading,
  };

  if (isLoading) {
    return null;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
