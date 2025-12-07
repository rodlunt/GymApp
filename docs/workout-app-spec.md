# Workout App Specification

## Overview

A lightweight, offline-first Android workout app for beginners. Built with React Native + Expo, designed for users who want to track workouts based on available equipment without unnecessary complexity.

---

## Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | React Native with Expo |
| UI Library | React Native Elements (platform-adaptive) |
| Styling | Platform-specific with custom theming |
| Storage | Local storage (AsyncStorage or SQLite) |
| Testing | Expo Go app on physical Android device |
| Build | Expo EAS Build for APK |

---

## Design System

### Visual Style
- Clean, modern, minimal, professional
- No emojis anywhere in the UI
- Card-based layout for browsing exercises and routines
- Tighter, focused layout during active workouts

### Colour Palette
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Accent | Teal | Teal |
| Background | White | Dark grey |
| Cards | Light grey | Darker grey |
| Text | Dark grey | White |
| Placeholder text | Light grey | Medium grey |

### Theme
- Light and dark mode with toggle in Settings
- Teal accent colour for buttons, active states, highlights, and PB displays

### Typography
- Platform-native fonts (SF Pro on iOS, Roboto on Android)
- Lighter weight font for secondary information (previous session values, 1RM display)

---

## Navigation

Bottom tab bar with 4 tabs:

1. **Workout** — Home screen with quick start
2. **Routines** — Browse and create routines
3. **Progress** — Segmented toggle between History and Charts
4. **Settings** — App configuration

---

## Features

### 1. Gym Profiles

Users create profiles representing their available equipment at different locations.

**Setup:**
- Wizard flow: name the gym, checklist of equipment
- Multiple profiles supported (e.g., "Home Gym", "Work Gym", "Hotel")
- "All" option bypasses equipment filters for full exercise library

**First Launch:**
- Prompt: "Set up your gym now?" with "Later" button
- User can explore app first, prompted again when creating a routine

### 2. Exercise Database

- Source: free-exercise-db (800+ exercises, public domain)
- Each exercise includes: name, image, primary muscles, secondary muscles, equipment required, difficulty level
- Images viewable on tap during workout (not always visible)
- No videos or detailed instructions

**Filtering:**
- Search by name
- Filter by muscle group
- Filter by gym profile (shows only exercises matching available equipment)

### 3. Pre-built Beginner Workouts

- Bundled with app by default
- Gym set to "All" so accessible immediately
- Gives new users something to try before setting up their own routines

### 4. Custom Routines

**Creation Wizard Steps:**
1. Name the routine
2. Select gym profile
3. Choose number of days and name each day (e.g., "Legs", "Push", "Pull")
4. Add exercises to each day via search and filters

**Exercise Configuration:**
- Default: 3 sets per exercise
- Option to add or remove sets
- Bodyweight exercises: toggle between bodyweight only or added weight

**Routine Properties:**
- Tied to a specific gym profile
- Multi-day splits supported
- No rest timer configuration (excluded by design)

### 5. Workout Execution

**Starting a Workout:**
- Quick start button on Workout tab
- Shows next scheduled session in the routine
- Option to skip ahead to a different session if user is behind schedule

**During Workout:**
- Tap through exercises (Next/Previous buttons, no swiping)
- Current exercise displayed prominently
- Exercise image hidden by default, viewable on tap

**Logging Sets:**
- All sets stacked vertically (Set 1, Set 2, Set 3 as rows)
- Each set row shows: weight input, reps input
- Previous session values shown as placeholder text in lighter font colour
- Weight input: 0.5kg increment roller OR tap to type manually
- Keyboard must not obscure important UI elements
- Working sets only (no warm-up tracking)

**Progression Nudge:**
- When opening an exercise, if user consistently hit high end of rep range last session:
  - Input field has subtle throbbing animation
  - Hint text: "Ready to level up?" or similar

### 6. Workout Completion

**Summary Screen:**
- Exercises completed
- Total volume
- Any new personal bests
- Celebration animation for new PBs (subtle but rewarding)

### 7. Progress Tracking

**Personal Bests:**
- Calculated 1RM using Epley formula: `weight × (1 + reps/30)`
- Displayed below exercise name during workout: "Est. 1RM: 85kg" in teal accent, lighter font weight

**History (Progress tab):**
- List of past workouts
- Tap to view details

**Charts (Progress tab):**
- Line chart showing estimated 1RM over time per exercise
- Simple, clean visualisation

### 8. Data Management

**Storage:**
- All data stored locally for offline use
- Workout history, routines, gym profiles, PBs

**Backup:**
- Export to file (JSON or CSV)
- Manual export from Settings

**Units:**
- Metric (kg) by default
- Option to switch to imperial (lbs) in Settings

---

## Screen Specifications

### Workout Tab (Home)
- Quick start button (prominent)
- Shows next scheduled session name
- "Skip to scheduled" option if user is behind

### Routines Tab
- Card list of saved routines
- Each card shows: routine name, gym profile, number of days
- FAB or button to create new routine

### Progress Tab
- Segmented control: History | Charts
- **History view:** List of completed workouts by date
- **Charts view:** Exercise picker, then line chart of 1RM over time

### Settings Tab
- Theme toggle (Light/Dark)
- Units toggle (kg/lbs)
- Manage gym profiles
- Export data

### Active Workout Screen
- Exercise name (prominent)
- Tap to view exercise image
- Est. 1RM display below name
- Vertically stacked set rows
- Each row: weight input | reps input
- Previous values as placeholder text
- Next/Previous navigation buttons
- End workout button

### Routine Creation Wizard
- Step 1: Routine name
- Step 2: Select gym profile
- Step 3: Add days, name each day
- Step 4: For each day, add exercises (search + filter UI)
- Step 5: Review and save

---

## Data Models

### GymProfile
```
{
  id: string
  name: string
  equipment: string[]
}
```

### Routine
```
{
  id: string
  name: string
  gymProfileId: string
  days: [
    {
      id: string
      name: string
      exercises: [
        {
          exerciseId: string
          sets: number
          useBodyweight: boolean
        }
      ]
    }
  ]
}
```

### WorkoutSession
```
{
  id: string
  routineId: string
  dayId: string
  date: timestamp
  exercises: [
    {
      exerciseId: string
      sets: [
        {
          weight: number
          reps: number
        }
      ]
    }
  ]
}
```

### PersonalBest
```
{
  exerciseId: string
  estimated1RM: number
  date: timestamp
  weight: number
  reps: number
}
```

---

## Excluded Features (By Design)

- Rest timers
- Warm-up set tracking
- Failure checkbox
- Videos or detailed exercise instructions
- Cloud sync
- Social features
- Push notifications
- iOS support (initial release)

---

## Development Setup

### Prerequisites
- Node.js
- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - Error Lens
- Expo Go app on Android phone
- Android Studio (for emulator, optional)

### Getting Started
```bash
npx create-expo-app workout-app
cd workout-app
npm install @rneui/themed @rneui/base
npx expo start
```

### Testing on Device
1. Open Expo Go on Android phone
2. Scan QR code from terminal
3. App loads with hot reload

### Building APK
```bash
npx eas build --platform android --profile preview
```

---

## Project Folder Structure

Keep the project tidy. All documentation lives in `/docs`. All testing assets live in `/testing`. No stray files.

```
workout-app/
├── App.js
├── app.json
├── package.json
├── assets/
│   ├── images/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI (Button, Card, Input, etc.)
│   │   ├── exercise/         # ExerciseCard, ExerciseImage, etc.
│   │   ├── workout/          # SetRow, WorkoutHeader, ProgressNudge, etc.
│   │   └── routine/          # RoutineCard, DayList, etc.
│   ├── screens/
│   │   ├── WorkoutTab/       # Home, ActiveWorkout, WorkoutSummary
│   │   ├── RoutinesTab/      # RoutineList, RoutineWizard steps
│   │   ├── ProgressTab/      # History, Charts
│   │   └── SettingsTab/      # Settings, GymProfileManager
│   ├── navigation/
│   │   └── TabNavigator.js
│   ├── context/
│   │   ├── ThemeContext.js
│   │   ├── WorkoutContext.js
│   │   └── GymProfileContext.js
│   ├── hooks/
│   │   ├── useExercises.js
│   │   ├── useWorkoutHistory.js
│   │   └── usePersonalBests.js
│   ├── services/
│   │   ├── storage.js        # AsyncStorage wrapper
│   │   └── calculations.js   # 1RM formulas, progression logic
│   ├── data/
│   │   └── exercises.json    # Bundled exercise database
│   ├── theme/
│   │   ├── colors.js
│   │   ├── spacing.js
│   │   └── index.js
│   └── utils/
│       └── helpers.js
├── docs/
│   ├── SPEC.md               # This specification
│   ├── ARCHITECTURE.md       # Technical decisions and patterns
│   ├── CHANGELOG.md          # Version history
│   └── UI_PATTERNS.md        # Component usage guidelines
└── testing/
    ├── docs/
    │   └── TEST_PLAN.md
    ├── reports/
    └── __tests__/            # Test files when added later
```

### Folder Rules
- **No documentation files outside `/docs`**
- **No test files outside `/testing`**
- Components grouped by feature domain, not file type
- Keep `/src/components/common` for truly reusable pieces only

---

## Storage Approach

**Choice: AsyncStorage**

Simple key-value storage. Data volume will remain small.

**Storage Keys:**
- `@gym_profiles` — Array of gym profiles
- `@routines` — Array of routines
- `@workout_history` — Array of completed sessions
- `@personal_bests` — Object keyed by exerciseId
- `@settings` — Theme, units, current routine progress

**Wrapper service** (`src/services/storage.js`):
```javascript
export const Storage = {
  get: async (key) => JSON.parse(await AsyncStorage.getItem(key)),
  set: async (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
  remove: async (key) => AsyncStorage.removeItem(key),
};
```

---

## Build Order

MVP first, but structure code so features slot in cleanly later.

### Phase 1: Foundation
1. Project setup with folder structure
2. Theme context (light/dark, teal accent, colours)
3. Tab navigation shell (4 tabs, placeholder screens)
4. Common components (Card, Button, Input with roller)

### Phase 2: Core Data
5. Bundle exercises.json in `/src/data`
6. Exercise browser screen with search
7. Gym profile setup wizard
8. Exercise filtering by gym profile and muscle group

### Phase 3: Routines
9. Routine creation wizard (all steps)
10. Routine list screen with cards
11. Storage integration for saving/loading routines

### Phase 4: Workout Execution
12. Active workout screen (set rows, inputs, navigation)
13. Previous session values as placeholders
14. Workout completion and storage
15. Summary screen with volume stats

### Phase 5: Progress
16. Personal best calculation and storage
17. 1RM display on exercise during workout
18. History list view
19. Charts view (1RM over time)

### Phase 6: Polish
20. Progression nudge (throbbing input, hint text)
21. PB celebration animation
22. Export to file
23. Pre-built beginner routines
24. First-launch gym setup prompt

### Build Principle
Even in Phase 1, structure components and contexts so Phase 5 features plug in without refactoring. Use consistent prop patterns and keep state management centralised in contexts.

---

## Exercise Data

**Approach: Bundled JSON**

Download `exercises.json` from free-exercise-db and place in `/src/data/exercises.json`. No network dependency, guaranteed offline from first launch.

**Image Handling:**
- Reference images via GitHub CDN URL stored in exercise data
- Cache images locally after first load using Expo's Image caching
- Fallback placeholder if offline and image not cached

---

## Future Considerations

- iOS release (requires $99/year Apple Developer account)
- Cloud backup option
- Additional exercise database integration
- Workout templates sharing

---

## Claude Code Guidance

When using Claude in VS Code to build this app, provide these instructions:

### Skills to Use
When working on UI components or screens, reference the **frontend-design** skill for clean, professional, non-generic styling. Read `/mnt/skills/public/frontend-design/SKILL.md` before creating any visual components.

### Prompting Tips
1. **Feed the spec first** — Start each session by sharing this spec file so Claude has full context
2. **Work in phases** — Ask Claude to complete one build phase at a time
3. **Reference the folder structure** — Remind Claude where files should go
4. **Be explicit about no clutter** — "All docs in /docs, all tests in /testing, no README files in component folders"

### Example Prompts

**Starting the project:**
```
Read the attached spec. Set up the project with the exact folder structure 
specified. Create placeholder files for the theme, navigation, and common 
components. No documentation outside /docs.
```

**Building a feature:**
```
Following the spec, build Phase 2 (Core Data). Bundle the exercises.json, 
create the exercise browser screen with search and filter components. 
Use React Native Elements. Keep styling clean and professional with the 
teal accent colour. Reference the frontend-design skill for UI patterns.
```

**Staying tidy:**
```
Before creating any new files, confirm: is this a doc (goes in /docs), 
a test (goes in /testing), or source code (goes in /src)? Do not create 
README files in component folders.
```

### Suggested Custom Skill

Consider creating a **react-native-workout-app** skill containing:
- This spec document
- React Native Elements component patterns for this app
- Theme configuration (teal accent, light/dark tokens)
- AsyncStorage patterns for the data models
- Common component templates (Card, SetRow, Input with roller)

This would let you say "use the workout-app skill" and have all context loaded automatically.

To create a skill, see `/mnt/skills/examples/skill-creator/SKILL.md`.
