import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoutineListScreen from '../screens/RoutinesTab/RoutineListScreen';
import CreateRoutineScreen from '../screens/RoutinesTab/CreateRoutineScreen';

const Stack = createNativeStackNavigator();

export default function RoutinesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoutineList" component={RoutineListScreen} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
    </Stack.Navigator>
  );
}
