import React, { createContext, useContext, useMemo } from 'react';
import exerciseData from '../data/exercises.json';

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
  const exercises = exerciseData.exercises;
  const muscleGroups = exerciseData.muscleGroups;
  const equipmentList = exerciseData.equipmentList;

  const getExerciseById = (id) => {
    return exercises.find(ex => ex.id === id);
  };

  const getExercisesByMuscle = (muscle) => {
    if (!muscle) return exercises;
    return exercises.filter(ex =>
      ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
    );
  };

  const getExercisesByEquipment = (equipmentIds) => {
    if (!equipmentIds || equipmentIds.length === 0) return exercises;
    return exercises.filter(ex =>
      ex.equipment.every(eq => equipmentIds.includes(eq) || eq === 'bodyweight')
    );
  };

  const searchExercises = (query) => {
    if (!query) return exercises;
    const lowerQuery = query.toLowerCase();
    return exercises.filter(ex =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(lowerQuery))
    );
  };

  const filterExercises = ({ query, muscle, equipment }) => {
    let filtered = exercises;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (muscle) {
      filtered = filtered.filter(ex =>
        ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
      );
    }

    if (equipment && equipment.length > 0) {
      filtered = filtered.filter(ex =>
        ex.equipment.every(eq => equipment.includes(eq) || eq === 'bodyweight')
      );
    }

    return filtered;
  };

  const value = {
    exercises,
    muscleGroups,
    equipmentList,
    getExerciseById,
    getExercisesByMuscle,
    getExercisesByEquipment,
    searchExercises,
    filterExercises,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercises must be used within an ExerciseProvider');
  }
  return context;
}
