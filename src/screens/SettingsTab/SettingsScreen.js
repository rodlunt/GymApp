import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useGymProfile } from '../../context/GymProfileContext';
import { spacing, fontSize, borderRadius } from '../../theme';

export default function SettingsScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { gymProfiles, activeProfileId, setActiveProfile } = useGymProfile();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          UNITS
        </Text>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Weight Unit
          </Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            kg
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            MY GYMS
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('GymSetup')}>
            <Text style={[styles.addLink, { color: colors.primary }]}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {gymProfiles.length === 0 ? (
          <TouchableOpacity
            style={[styles.emptyGymCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={() => navigation.navigate('GymSetup')}
          >
            <Text style={[styles.emptyGymText, { color: colors.textSecondary }]}>
              No gyms set up yet
            </Text>
            <Text style={[styles.emptyGymSubtext, { color: colors.primary }]}>
              Tap to add your first gym
            </Text>
          </TouchableOpacity>
        ) : (
          gymProfiles.map(profile => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.gymCard,
                { backgroundColor: colors.card },
                activeProfileId === profile.id && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => setActiveProfile(profile.id)}
              onLongPress={() => navigation.navigate('GymSetup', { profile })}
            >
              <View style={styles.gymInfo}>
                <Text style={[styles.gymName, { color: colors.text }]}>
                  {profile.name}
                </Text>
                <Text style={[styles.gymEquipment, { color: colors.textSecondary }]}>
                  {profile.equipment?.length || 0} equipment items
                </Text>
              </View>
              {activeProfileId === profile.id && (
                <Text style={[styles.activeLabel, { color: colors.primary }]}>Active</Text>
              )}
            </TouchableOpacity>
          ))
        )}
        {gymProfiles.length > 0 && (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Tap to select • Long press to edit
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          DATA
        </Text>
        <TouchableOpacity style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Export Data
          </Text>
          <Text style={[styles.chevron, { color: colors.textSecondary }]}>
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  addLink: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },
  settingLabel: {
    fontSize: fontSize.md,
  },
  settingValue: {
    fontSize: fontSize.md,
  },
  chevron: {
    fontSize: fontSize.lg,
  },
  emptyGymCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyGymText: {
    fontSize: fontSize.md,
  },
  emptyGymSubtext: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  gymCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  gymEquipment: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  activeLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  hint: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
