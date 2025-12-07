import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/WorkoutTab/HomeScreen';
import ActiveWorkoutScreen from '../screens/WorkoutTab/ActiveWorkoutScreen';
import WorkoutSummaryScreen from '../screens/WorkoutTab/WorkoutSummaryScreen';

const Stack = createNativeStackNavigator();

export default function WorkoutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutHome" component={HomeScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
}
