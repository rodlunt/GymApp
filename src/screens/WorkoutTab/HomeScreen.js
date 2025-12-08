import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useGymProfile } from '../../context/GymProfileContext';
import { useSettings } from '../../context/SettingsContext';
import { spacing, fontSize, borderRadius } from '../../theme';
import Button from '../../components/common/Button';

const GYM_PROMPT_DISMISSED_KEY = '@gym_setup_prompt_dismissed';

const calculateWeeklyVolume = (history) => {
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  let total = 0;
  history.forEach(session => {
    if (session.date >= oneWeekAgo) {
      session.exercises?.forEach(ex => {
        ex.sets?.forEach(set => {
          if (set.weight && set.reps) {
            total += parseFloat(set.weight) * parseInt(set.reps);
          }
        });
      });
    }
  });
  return Math.round(total);
};

const getRecentWorkouts = (history, days = 7) => {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return history.filter(s => s.date >= cutoff).length;
};

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { routines, currentRoutine, setCurrentRoutine, workoutHistory, personalBests } = useWorkout();
  const { gymProfiles } = useGymProfile();
  const { units, displayWeight } = useSettings();
  const [showRoutinePicker, setShowRoutinePicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showGymPrompt, setShowGymPrompt] = useState(false);

  // Check if we should show gym setup prompt on first launch
  useEffect(() => {
    const checkGymPrompt = async () => {
      if (gymProfiles.length === 0) {
        const dismissed = await AsyncStorage.getItem(GYM_PROMPT_DISMISSED_KEY);
        if (!dismissed) {
          setShowGymPrompt(true);
        }
      }
    };
    checkGymPrompt();
  }, [gymProfiles]);

  const dismissGymPrompt = async () => {
    await AsyncStorage.setItem(GYM_PROMPT_DISMISSED_KEY, 'true');
    setShowGymPrompt(false);
  };

  const handleSetupGym = () => {
    setShowGymPrompt(false);
    navigation.navigate('Settings', { screen: 'GymSetup' });
  };

  const weeklyVolume = useMemo(() => calculateWeeklyVolume(workoutHistory), [workoutHistory]);
  const workoutsThisWeek = useMemo(() => getRecentWorkouts(workoutHistory, 7), [workoutHistory]);
  const pbCount = useMemo(() => Object.keys(personalBests).length, [personalBests]);

  // Get volume history for mini chart (last 4 weeks)
  const volumeHistory = useMemo(() => {
    const weeks = [];
    const now = Date.now();
    for (let i = 3; i >= 0; i--) {
      const weekStart = now - (i + 1) * 7 * 24 * 60 * 60 * 1000;
      const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
      let volume = 0;
      workoutHistory.forEach(session => {
        if (session.date >= weekStart && session.date < weekEnd) {
          session.exercises?.forEach(ex => {
            ex.sets?.forEach(set => {
              if (set.weight && set.reps) {
                volume += parseFloat(set.weight) * parseInt(set.reps);
              }
            });
          });
        }
      });
      weeks.push(volume);
    }
    return weeks;
  }, [workoutHistory]);

  const handleStartWorkout = () => {
    if (routines.length === 0) {
      navigation.navigate('ActiveWorkout');
    } else if (!currentRoutine) {
      setShowRoutinePicker(true);
    } else {
      setShowDayPicker(true);
    }
  };

  const handleSelectRoutine = (routine) => {
    setCurrentRoutine(routine);
    setShowRoutinePicker(false);
    setShowDayPicker(true);
  };

  const handleSelectDay = (routine, day) => {
    setShowDayPicker(false);
    navigation.navigate('ActiveWorkout', { routine, day });
  };

  const handleQuickStart = () => {
    setShowDayPicker(false);
    setShowRoutinePicker(false);
    navigation.navigate('ActiveWorkout');
  };

  const maxVolume = Math.max(...volumeHistory, 1);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Workout</Text>

      {/* First Launch Gym Setup Prompt */}
      {showGymPrompt && (
        <View style={[styles.gymPromptCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
          <Text style={[styles.gymPromptTitle, { color: colors.text }]}>
            Set up your gym?
          </Text>
          <Text style={[styles.gymPromptText, { color: colors.textSecondary }]}>
            Tell us what equipment you have access to for personalized exercise recommendations.
          </Text>
          <View style={styles.gymPromptButtons}>
            <TouchableOpacity
              style={[styles.gymPromptButton, { backgroundColor: colors.primary }]}
              onPress={handleSetupGym}
            >
              <Text style={styles.gymPromptButtonText}>Set Up Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gymPromptLater}
              onPress={dismissGymPrompt}
            >
              <Text style={[styles.gymPromptLaterText, { color: colors.textSecondary }]}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Current Routine Card */}
      {currentRoutine ? (
        <TouchableOpacity
          style={[styles.routineCard, { backgroundColor: colors.card }]}
          onPress={() => setShowRoutinePicker(true)}
        >
          <Text style={[styles.routineLabel, { color: colors.textSecondary }]}>
            CURRENT ROUTINE
          </Text>
          <Text style={[styles.routineName, { color: colors.text }]}>
            {currentRoutine.name}
          </Text>
          <Text style={[styles.routineDays, { color: colors.textSecondary }]}>
            {currentRoutine.days?.length || 0} days • Tap to change
          </Text>
        </TouchableOpacity>
      ) : routines.length > 0 ? (
        <TouchableOpacity
          style={[styles.routineCard, styles.emptyRoutineCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onPress={() => setShowRoutinePicker(true)}
        >
          <Text style={[styles.emptyRoutineText, { color: colors.textSecondary }]}>
            Select a routine to get started
          </Text>
          <Text style={[styles.tapHint, { color: colors.primary }]}>
            Tap to choose
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.routineCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyRoutineText, { color: colors.textSecondary }]}>
            No routines yet
          </Text>
          <Text style={[styles.routineDays, { color: colors.textSecondary }]}>
            Go to Routines tab to create one
          </Text>
        </View>
      )}

      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Start Workout"
          onPress={handleStartWorkout}
          size="large"
        />
      </View>

      {/* Stats Overview */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        THIS WEEK
      </Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {workoutsThisWeek}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Workouts
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {displayWeight(weeklyVolume) > 1000 ? `${(displayWeight(weeklyVolume) / 1000).toFixed(1)}k` : Math.round(displayWeight(weeklyVolume))}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {units} Volume
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {pbCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            PRs Set
          </Text>
        </View>
      </View>

      {/* Mini Volume Chart */}
      {workoutHistory.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>
            VOLUME TREND (4 WEEKS)
          </Text>
          <View style={[styles.miniChart, { backgroundColor: colors.card }]}>
            <View style={styles.chartBars}>
              {volumeHistory.map((vol, i) => (
                <View key={i} style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: Math.max((vol / maxVolume) * 80, 4),
                        backgroundColor: i === 3 ? colors.primary : colors.border,
                      },
                    ]}
                  />
                  <Text style={[styles.chartBarLabel, { color: colors.textSecondary }]}>
                    {i === 3 ? 'This' : `${3 - i}w`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Routine Picker Modal */}
      <Modal
        visible={showRoutinePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoutinePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Routine
            </Text>
            <ScrollView style={styles.modalList}>
              {routines.map(routine => (
                <TouchableOpacity
                  key={routine.id}
                  style={[styles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelectRoutine(routine)}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {routine.name}
                  </Text>
                  <Text style={[styles.modalItemSub, { color: colors.textSecondary }]}>
                    {routine.days?.length || 0} days
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowRoutinePicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Day Picker Modal */}
      <Modal
        visible={showDayPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {currentRoutine?.name || 'Select Day'}
            </Text>
            <ScrollView style={styles.modalList}>
              {currentRoutine?.days?.map(day => (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelectDay(currentRoutine, day)}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {day.name}
                  </Text>
                  <Text style={[styles.modalItemSub, { color: colors.textSecondary }]}>
                    {day.exercises?.length || 0} exercises
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondary}
                onPress={handleQuickStart}
              >
                <Text style={[styles.modalSecondaryText, { color: colors.primary }]}>
                  Quick Start (Empty)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowDayPicker(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  routineCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  emptyRoutineCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  routineLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  routineName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  routineDays: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  emptyRoutineText: {
    fontSize: fontSize.md,
  },
  tapHint: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  miniChart: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 30,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  chartBarLabel: {
    fontSize: fontSize.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  modalItemSub: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  modalActions: {
    marginTop: spacing.md,
  },
  modalSecondary: {
    padding: spacing.md,
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  modalCancel: {
    padding: spacing.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: fontSize.md,
  },
  gymPromptCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  gymPromptTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  gymPromptText: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  gymPromptButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  gymPromptButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  gymPromptButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  gymPromptLater: {
    padding: spacing.sm,
  },
  gymPromptLaterText: {
    fontSize: fontSize.sm,
  },
});
