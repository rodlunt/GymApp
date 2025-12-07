import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useWorkout } from '../../context/WorkoutContext';
import { spacing, fontSize, borderRadius } from '../../theme';
import Button from '../../components/common/Button';

export default function CreateRoutineScreen({ navigation }) {
  const { colors } = useTheme();
  const { addRoutine } = useWorkout();
  const [routineName, setRoutineName] = useState('');
  const [days, setDays] = useState([{ id: '1', name: '', exercises: [] }]);

  const addDay = () => {
    setDays([...days, { id: Date.now().toString(), name: '', exercises: [] }]);
  };

  const updateDayName = (dayId, name) => {
    setDays(days.map(d => (d.id === dayId ? { ...d, name } : d)));
  };

  const removeDay = (dayId) => {
    if (days.length > 1) {
      setDays(days.filter(d => d.id !== dayId));
    }
  };

  const addExercise = (dayId) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: [...d.exercises, { id: Date.now().toString(), name: '', sets: 3 }],
        };
      }
      return d;
    }));
  };

  const updateExercise = (dayId, exerciseId, field, value) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: d.exercises.map(ex =>
            ex.id === exerciseId ? { ...ex, [field]: value } : ex
          ),
        };
      }
      return d;
    }));
  };

  const removeExercise = (dayId, exerciseId) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: d.exercises.filter(ex => ex.id !== exerciseId),
        };
      }
      return d;
    }));
  };

  const handleSave = async () => {
    if (!routineName.trim()) {
      return;
    }

    const routine = {
      id: Date.now().toString(),
      name: routineName.trim(),
      days: days.map(d => ({
        id: d.id,
        name: d.name.trim() || `Day ${days.indexOf(d) + 1}`,
        exercises: d.exercises.map(ex => ({
          exerciseId: ex.id,
          name: ex.name.trim(),
          sets: parseInt(ex.sets) || 3,
        })),
      })),
    };

    await addRoutine(routine);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>New Routine</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Routine Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="e.g., Push Pull Legs"
          placeholderTextColor={colors.placeholder}
          value={routineName}
          onChangeText={setRoutineName}
        />

        {days.map((day, dayIndex) => (
          <View key={day.id} style={[styles.dayCard, { backgroundColor: colors.card }]}>
            <View style={styles.dayHeader}>
              <TextInput
                style={[styles.dayInput, { color: colors.text }]}
                placeholder={`Day ${dayIndex + 1}`}
                placeholderTextColor={colors.placeholder}
                value={day.name}
                onChangeText={(text) => updateDayName(day.id, text)}
              />
              {days.length > 1 && (
                <TouchableOpacity onPress={() => removeDay(day.id)}>
                  <Text style={[styles.removeText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            {day.exercises.map((exercise) => (
              <View key={exercise.id} style={[styles.exerciseRow, { borderTopColor: colors.border }]}>
                <TextInput
                  style={[styles.exerciseInput, { color: colors.text }]}
                  placeholder="Exercise name"
                  placeholderTextColor={colors.placeholder}
                  value={exercise.name}
                  onChangeText={(text) => updateExercise(day.id, exercise.id, 'name', text)}
                />
                <View style={styles.setsContainer}>
                  <TextInput
                    style={[styles.setsInput, { backgroundColor: colors.background, color: colors.text }]}
                    keyboardType="numeric"
                    value={exercise.sets.toString()}
                    onChangeText={(text) => updateExercise(day.id, exercise.id, 'sets', text)}
                  />
                  <Text style={[styles.setsLabel, { color: colors.textSecondary }]}>sets</Text>
                </View>
                <TouchableOpacity onPress={() => removeExercise(day.id, exercise.id)}>
                  <Text style={[styles.removeExText, { color: colors.error }]}>X</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => addExercise(day.id)}
            >
              <Text style={[styles.addExerciseText, { color: colors.primary }]}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addDayButton, { borderColor: colors.primary }]}
          onPress={addDay}
        >
          <Text style={[styles.addDayText, { color: colors.primary }]}>+ Add Day</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  cancelText: {
    fontSize: fontSize.md,
  },
  saveText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  input: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  dayCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayInput: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    flex: 1,
  },
  removeText: {
    fontSize: fontSize.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  exerciseInput: {
    flex: 1,
    fontSize: fontSize.md,
  },
  setsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  setsInput: {
    width: 40,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    textAlign: 'center',
    fontSize: fontSize.md,
  },
  setsLabel: {
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
  removeExText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    padding: spacing.xs,
  },
  addExerciseButton: {
    paddingVertical: spacing.sm,
  },
  addExerciseText: {
    fontSize: fontSize.md,
  },
  addDayButton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  addDayText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
