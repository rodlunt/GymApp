import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CACHE_KEY = 'exercise_images_v4';
const IMAGE_DIR = `${FileSystem.cacheDirectory}exercise-images/`;
const BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Maps app exercise IDs to Free Exercise DB folder names
const EXERCISE_IMAGE_MAP = {
  // Chest
  'bench-press': 'Barbell_Bench_Press_-_Medium_Grip',
  'incline-bench-press': 'Barbell_Incline_Bench_Press_-_Medium_Grip',
  'decline-bench-press': 'Decline_Barbell_Bench_Press',
  'dumbbell-bench-press': 'Dumbbell_Bench_Press',
  'incline-dumbbell-press': 'Incline_Dumbbell_Press',
  'dumbbell-flyes': 'Dumbbell_Flyes',
  'cable-crossover': 'Cable_Crossover',
  'pec-deck-fly': 'Butterfly',
  'push-ups': 'Pushups',

  // Back
  'deadlift': 'Barbell_Deadlift',
  'pull-ups': 'Pullups',
  'chin-ups': 'Chin-Up',
  'lat-pulldown': 'Wide-Grip_Lat_Pulldown',
  'barbell-row': 'Bent_Over_Barbell_Row',
  'dumbbell-row': 'One-Arm_Dumbbell_Row',
  't-bar-row': 'T-Bar_Row_with_Handle',
  'cable-row': 'Seated_Cable_Rows',
  'face-pulls': 'Face_Pull',

  // Legs
  'squat': 'Barbell_Squat',
  'front-squat': 'Front_Barbell_Squat',
  'hack-squat': 'Barbell_Hack_Squat',
  'leg-press': 'Leg_Press',
  'lunges': 'Barbell_Lunge',
  'dumbbell-lunges': 'Dumbbell_Lunges_Walking',
  'leg-extension': 'Leg_Extensions',
  'leg-curl': 'Lying_Leg_Curls',
  'romanian-deadlift': 'Romanian_Deadlift',
  'calf-raises': 'Standing_Calf_Raises',
  'goblet-squat': 'Goblet_Squat',

  // Shoulders
  'overhead-press': 'Standing_Military_Press',
  'dumbbell-shoulder-press': 'Dumbbell_Shoulder_Press',
  'arnold-press': 'Arnold_Dumbbell_Press',
  'lateral-raises': 'Side_Lateral_Raise',
  'front-raises': 'Front_Dumbbell_Raise',
  'rear-delt-fly': 'Seated_Bent-Over_Rear_Delt_Raise',
  'upright-row': 'Upright_Barbell_Row',
  'machine-shoulder-press': 'Leverage_Shoulder_Press',

  // Arms - Biceps
  'barbell-curl': 'Barbell_Curl',
  'dumbbell-curl': 'Dumbbell_Bicep_Curl',
  'hammer-curl': 'Hammer_Curls',
  'preacher-curl': 'Preacher_Curl',
  'concentration-curl': 'Concentration_Curls',
  'ez-bar-curl': 'EZ-Bar_Curl',
  'cable-curl': 'Cable_Hammer_Curls_-_Rope_Attachment',

  // Arms - Triceps
  'tricep-pushdown': 'Triceps_Pushdown',
  'skull-crushers': 'Lying_Triceps_Press',
  'tricep-dips': 'Dips_-_Triceps_Version',
  'dips': 'Dips_-_Triceps_Version',
  'overhead-tricep-extension': 'Standing_Dumbbell_Triceps_Extension',
  'close-grip-bench-press': 'Close-Grip_Barbell_Bench_Press',
  'tricep-kickback': 'Tricep_Dumbbell_Kickback',

  // Core
  'crunches': 'Crunches',
  'sit-ups': '3_4_Sit-Up',
  'plank': 'Plank',
  'russian-twist': 'Russian_Twist',
  'hanging-leg-raises': 'Hanging_Leg_Raise',
  'decline-crunches': 'Decline_Crunch',
  'cable-crunch': 'Cable_Crunch',
  'ab-wheel': 'Ab_Roller',

  // Other
  'shrugs': 'Dumbbell_Shrug',
  'barbell-shrugs': 'Barbell_Shrug',
  'farmers-walk': 'Farmers_Walk',
  'hip-thrust': 'Barbell_Hip_Thrust',
};

class ExerciseImageService {
  constructor() {
    this.localPathCache = {};
    this.initializeDirectory();
    this.loadCache();
  }

  async initializeDirectory() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.log('Failed to create image directory:', error);
    }
  }

  async loadCache() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        this.localPathCache = JSON.parse(cached);
      }
    } catch (error) {
      console.log('Failed to load image cache:', error);
    }
  }

  async saveCache() {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(this.localPathCache));
    } catch (error) {
      console.log('Failed to save image cache:', error);
    }
  }

  getImageUrl(exerciseId) {
    const folderName = EXERCISE_IMAGE_MAP[exerciseId];
    if (!folderName) return null;
    return `${BASE_URL}/${folderName}/0.jpg`;
  }

  getLocalPath(exerciseId) {
    return `${IMAGE_DIR}${exerciseId}.jpg`;
  }

  async getImageForExercise(exerciseId) {
    // Check if we have a local cached file
    if (this.localPathCache[exerciseId]) {
      const fileInfo = await FileSystem.getInfoAsync(this.localPathCache[exerciseId]);
      if (fileInfo.exists) {
        return this.localPathCache[exerciseId];
      }
    }

    // Check if we have a mapping for this exercise
    const remoteUrl = this.getImageUrl(exerciseId);
    if (!remoteUrl) {
      return null;
    }

    // Download and cache locally
    try {
      const localPath = this.getLocalPath(exerciseId);
      const downloadResult = await FileSystem.downloadAsync(remoteUrl, localPath);

      if (downloadResult.status === 200) {
        this.localPathCache[exerciseId] = localPath;
        this.saveCache();
        return localPath;
      }
    } catch (error) {
      console.log('Failed to download image for:', exerciseId, error);
    }

    // Fallback to remote URL if download fails
    return remoteUrl;
  }

  async getImagesForExercises(exerciseIds) {
    const results = {};
    for (const id of exerciseIds) {
      results[id] = await this.getImageForExercise(id);
    }
    return results;
  }

  async clearCache() {
    this.localPathCache = {};
    await AsyncStorage.removeItem(CACHE_KEY);

    try {
      const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(IMAGE_DIR, { idempotent: true });
        await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.log('Failed to clear image cache:', error);
    }
  }

  async refreshExerciseImage(exerciseId) {
    const localPath = this.localPathCache[exerciseId];
    if (localPath) {
      try {
        await FileSystem.deleteAsync(localPath, { idempotent: true });
      } catch (error) {
        console.log('Failed to delete cached image:', error);
      }
    }

    delete this.localPathCache[exerciseId];
    await this.saveCache();

    return this.getImageForExercise(exerciseId);
  }
}

export const exerciseImageApi = new ExerciseImageService();
export default exerciseImageApi;
