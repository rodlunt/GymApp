import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../screens/SettingsTab/SettingsScreen';
import GymSetupScreen from '../screens/SettingsTab/GymSetupScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="GymSetup" component={GymSetupScreen} />
    </Stack.Navigator>
  );
}
