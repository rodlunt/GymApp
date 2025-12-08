import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider } from './src/context/ThemeContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import { GymProfileProvider } from './src/context/GymProfileContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { ExerciseProvider } from './src/context/ExerciseContext';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <ExerciseProvider>
            <GymProfileProvider>
              <WorkoutProvider>
                <NavigationContainer>
                  <StatusBar style="light" />
                  <TabNavigator />
                </NavigationContainer>
              </WorkoutProvider>
            </GymProfileProvider>
          </ExerciseProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
