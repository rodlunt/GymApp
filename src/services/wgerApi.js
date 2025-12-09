import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://wger.de/api/v2';
const CACHE_KEY = 'wger_exercise_images';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Map our exercise names to wger search terms
const EXERCISE_NAME_MAP = {
  'bench-press': 'bench press',
  'incline-bench-press': 'incline bench press',
  'decline-bench-press': 'decline bench press',
  'dumbbell-bench-press': 'dumbbell bench press',
  'incline-dumbbell-press': 'incline dumbbell press',
  'decline-dumbbell-press': 'decline dumbbell press',
  'dumbbell-flyes': 'dumbbell flyes',
  'incline-dumbbell-flyes': 'incline dumbbell flyes',
  'push-ups': 'push ups',
  'cable-crossover': 'cable crossover',
  'machine-chest-press': 'chest press machine',
  'pec-deck-fly': 'pec deck',
  'squat': 'squat',
  'front-squat': 'front squat',
  'goblet-squat': 'goblet squat',
  'leg-press': 'leg press',
  'hack-squat': 'hack squat',
  'leg-extension': 'leg extension',
  'lunges': 'lunges',
  'dumbbell-lunges': 'dumbbell lunges',
  'deadlift': 'deadlift',
  'romanian-deadlift': 'romanian deadlift',
  'dumbbell-romanian-deadlift': 'dumbbell romanian deadlift',
  'leg-curl': 'leg curl',
  'pull-ups': 'pull ups',
  'chin-ups': 'chin ups',
  'assisted-pull-ups': 'assisted pull ups',
  'lat-pulldown': 'lat pulldown',
  'machine-lat-pulldown': 'lat pulldown',
  'barbell-row': 'barbell row',
  'dumbbell-row': 'dumbbell row',
  'cable-row': 'cable row',
  't-bar-row': 't-bar row',
  'face-pulls': 'face pulls',
  'overhead-press': 'overhead press',
  'dumbbell-shoulder-press': 'dumbbell shoulder press',
  'machine-shoulder-press': 'shoulder press machine',
  'lateral-raises': 'lateral raises',
  'front-raises': 'front raises',
  'reverse-flyes': 'reverse flyes',
  'barbell-curl': 'barbell curl',
  'dumbbell-curl': 'dumbbell curl',
  'hammer-curl': 'hammer curl',
  'preacher-curl': 'preacher curl',
  'ez-bar-curl': 'ez bar curl',
  'cable-curl': 'cable curl',
  'tricep-pushdown': 'tricep pushdown',
  'skull-crushers': 'skull crushers',
  'overhead-tricep-extension': 'tricep extension',
  'dips': 'dips',
  'close-grip-bench-press': 'close grip bench press',
  'calf-raises': 'calf raises',
  'seated-calf-raises': 'seated calf raises',
  'hip-thrust': 'hip thrust',
  'glute-bridge': 'glute bridge',
  'hip-abduction': 'hip abduction',
  'hip-adduction': 'hip adduction',
  'cable-kickback': 'cable kickback',
  'plank': 'plank',
  'crunches': 'crunches',
  'decline-situps': 'sit ups',
  'decline-crunches': 'crunches',
  'hanging-leg-raises': 'hanging leg raises',
  'cable-crunch': 'cable crunch',
  'russian-twist': 'russian twist',
  'shrugs': 'shrugs',
  'barbell-shrugs': 'barbell shrugs',
  'wrist-curls': 'wrist curls',
  'farmers-walk': 'farmers walk',
  'kettlebell-swing': 'kettlebell swing',
  'kettlebell-goblet-squat': 'goblet squat',
  'smith-machine-bench-press': 'smith machine bench press',
  'smith-machine-incline-press': 'smith machine incline press',
  'smith-machine-squat': 'smith machine squat',
  'smith-machine-shoulder-press': 'smith machine shoulder press',
};

class WgerApiService {
  constructor() {
    this.imageCache = {};
    this.loadCache();
  }

  async loadCache() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          this.imageCache = data;
        }
      }
    } catch (error) {
      console.log('Failed to load image cache:', error);
    }
  }

  async saveCache() {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        data: this.imageCache,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.log('Failed to save image cache:', error);
    }
  }

  async searchExercise(searchTerm) {
    try {
      // Search for exercise by name (English = language 2)
      const response = await fetch(
        `${BASE_URL}/exercise/?language=2&limit=20&search=${encodeURIComponent(searchTerm)}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.log('Exercise search failed:', error);
      return [];
    }
  }

  async getExerciseImages(exerciseBaseId) {
    try {
      const response = await fetch(
        `${BASE_URL}/exerciseimage/?exercise_base=${exerciseBaseId}&is_main=True`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.log('Image fetch failed:', error);
      return [];
    }
  }

  async getImageForExercise(exerciseId) {
    // Check cache first
    if (this.imageCache[exerciseId]) {
      return this.imageCache[exerciseId];
    }

    const searchTerm = EXERCISE_NAME_MAP[exerciseId] || exerciseId.replace(/-/g, ' ');

    try {
      // Search for exercise
      const exercises = await this.searchExercise(searchTerm);

      if (exercises.length === 0) {
        this.imageCache[exerciseId] = null;
        return null;
      }

      // Get the exercise base ID from the first result
      const exerciseBaseId = exercises[0].exercise_base;

      // Fetch images for this exercise
      const images = await this.getExerciseImages(exerciseBaseId);

      if (images.length > 0) {
        const imageUrl = images[0].image;
        this.imageCache[exerciseId] = imageUrl;
        this.saveCache();
        return imageUrl;
      }

      // If no main image, try getting any image
      const allImagesResponse = await fetch(
        `${BASE_URL}/exerciseimage/?exercise_base=${exerciseBaseId}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (allImagesResponse.ok) {
        const allImagesData = await allImagesResponse.json();
        if (allImagesData.results && allImagesData.results.length > 0) {
          const imageUrl = allImagesData.results[0].image;
          this.imageCache[exerciseId] = imageUrl;
          this.saveCache();
          return imageUrl;
        }
      }

      this.imageCache[exerciseId] = null;
      return null;
    } catch (error) {
      console.log('Failed to get image for exercise:', exerciseId, error);
      this.imageCache[exerciseId] = null;
      return null;
    }
  }

  // Batch fetch images for multiple exercises
  async getImagesForExercises(exerciseIds) {
    const results = {};

    // Check cache first and identify missing
    const missing = [];
    for (const id of exerciseIds) {
      if (this.imageCache[id] !== undefined) {
        results[id] = this.imageCache[id];
      } else {
        missing.push(id);
      }
    }

    // Fetch missing images (limit concurrent requests)
    const batchSize = 3;
    for (let i = 0; i < missing.length; i += batchSize) {
      const batch = missing.slice(i, i + batchSize);
      const promises = batch.map(id => this.getImageForExercise(id));
      const batchResults = await Promise.all(promises);

      batch.forEach((id, index) => {
        results[id] = batchResults[index];
      });
    }

    return results;
  }

  clearCache() {
    this.imageCache = {};
    AsyncStorage.removeItem(CACHE_KEY);
  }
}

export const wgerApi = new WgerApiService();
export default wgerApi;
