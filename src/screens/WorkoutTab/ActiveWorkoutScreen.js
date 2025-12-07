import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, fontSize, borderRadius } from '../../theme';
import Button from '../../components/common/Button';

// Demo exercises for testing
const DEMO_EXERCISES = [
  { id: '1', name: 'Bench Press', sets: 3 },
  { id: '2', name: 'Squat', sets: 3 },
  { id: '3', name: 'Deadlift', sets: 3 },
];

export default function ActiveWorkoutScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutData, setWorkoutData] = useState(
    DEMO_EXERCISES.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      sets: Array(ex.sets).fill({ weight: '', reps: '' }),
    }))
  );

  const currentExercise = workoutData[currentExerciseIndex];

  const updateSet = (setIndex, field, value) => {
    const newData = [...workoutData];
    const newSets = [...newData[currentExerciseIndex].sets];
    newSets[setIndex] = { ...newSets[setIndex], [field]: value };
    newData[currentExerciseIndex].sets = newSets;
    setWorkoutData(newData);
  };

  const goNext = () => {
    if (currentExerciseIndex < workoutData.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const finishWorkout = () => {
    // Calculate summary
    let totalSets = 0;
    let totalVolume = 0;
    workoutData.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.weight && set.reps) {
          totalSets++;
          totalVolume += parseFloat(set.weight) * parseInt(set.reps);
        }
      });
    });

    navigation.replace('WorkoutSummary', {
      exerciseCount: workoutData.length,
      totalSets,
      totalVolume: Math.round(totalVolume),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.exerciseNumber, { color: colors.textSecondary }]}>
          Exercise {currentExerciseIndex + 1} of {workoutData.length}
        </Text>
        <Text style={[styles.exerciseName, { color: colors.text }]}>
          {currentExercise.name}
        </Text>
      </View>

      <ScrollView style={styles.setsContainer}>
        {currentExercise.sets.map((set, index) => (
          <View key={index} style={[styles.setRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.setLabel, { color: colors.textSecondary }]}>
              Set {index + 1}
            </Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="kg"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(value) => updateSet(index, 'weight', value)}
              />
              <Text style={[styles.inputSeparator, { color: colors.textSecondary }]}>x</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="reps"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(value) => updateSet(index, 'reps', value)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.card, opacity: currentExerciseIndex === 0 ? 0.5 : 1 }]}
          onPress={goPrevious}
          disabled={currentExerciseIndex === 0}
        >
          <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
        </TouchableOpacity>

        {currentExerciseIndex === workoutData.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={finishWorkout}
          >
            <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={goNext}
          >
            <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelText, { color: colors.error }]}>Cancel Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  exerciseNumber: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  exerciseName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  setsContainer: {
    flex: 1,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  setLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    width: 60,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 70,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  inputSeparator: {
    marginHorizontal: spacing.sm,
    fontSize: fontSize.lg,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: fontSize.md,
  },
});
