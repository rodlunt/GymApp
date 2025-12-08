import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { spacing, fontSize, borderRadius } from '../../theme';
import Button from '../../components/common/Button';

const formatDuration = (ms) => {
  if (!ms) return '0 min';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
};

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { units, displayWeight } = useSettings();
  const { exerciseCount = 0, totalSets = 0, totalVolume = 0, newPRs = 0, duration = 0 } = route.params || {};

  const handleDone = () => {
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>Workout Complete</Text>

        {newPRs > 0 && (
          <View style={[styles.prBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.prText, { color: colors.primary }]}>
              {newPRs} New PR{newPRs > 1 ? 's' : ''}!
            </Text>
          </View>
        )}

        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(duration)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{exerciseCount}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sets Completed</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{totalSets}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Volume</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {displayWeight(totalVolume) > 1000 ? `${(displayWeight(totalVolume) / 1000).toFixed(1)}k` : Math.round(displayWeight(totalVolume))} {units}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Done" onPress={handleDone} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },
  statsCard: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  statLabel: {
    fontSize: fontSize.md,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  prBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  prText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
