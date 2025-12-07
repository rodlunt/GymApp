export const STARTER_ROUTINES = [
  {
    id: 'template_ppl',
    name: 'Push Pull Legs',
    description: '3-day split for balanced muscle growth',
    days: [
      {
        id: 'ppl_push',
        name: 'Push Day',
        exercises: [
          { exerciseId: 'bench_press', name: 'Bench Press', sets: 4 },
          { exerciseId: 'ohp', name: 'Overhead Press', sets: 3 },
          { exerciseId: 'incline_db', name: 'Incline Dumbbell Press', sets: 3 },
          { exerciseId: 'tricep_pushdown', name: 'Tricep Pushdown', sets: 3 },
          { exerciseId: 'lateral_raise', name: 'Lateral Raises', sets: 3 },
        ],
      },
      {
        id: 'ppl_pull',
        name: 'Pull Day',
        exercises: [
          { exerciseId: 'deadlift', name: 'Deadlift', sets: 4 },
          { exerciseId: 'pullup', name: 'Pull-ups', sets: 3 },
          { exerciseId: 'barbell_row', name: 'Barbell Row', sets: 3 },
          { exerciseId: 'face_pull', name: 'Face Pulls', sets: 3 },
          { exerciseId: 'bicep_curl', name: 'Bicep Curls', sets: 3 },
        ],
      },
      {
        id: 'ppl_legs',
        name: 'Leg Day',
        exercises: [
          { exerciseId: 'squat', name: 'Squat', sets: 4 },
          { exerciseId: 'romanian_dl', name: 'Romanian Deadlift', sets: 3 },
          { exerciseId: 'leg_press', name: 'Leg Press', sets: 3 },
          { exerciseId: 'leg_curl', name: 'Leg Curls', sets: 3 },
          { exerciseId: 'calf_raise', name: 'Calf Raises', sets: 4 },
        ],
      },
    ],
  },
  {
    id: 'template_upper_lower',
    name: 'Upper Lower',
    description: '4-day split for strength and size',
    days: [
      {
        id: 'ul_upper1',
        name: 'Upper A',
        exercises: [
          { exerciseId: 'bench_press', name: 'Bench Press', sets: 4 },
          { exerciseId: 'barbell_row', name: 'Barbell Row', sets: 4 },
          { exerciseId: 'ohp', name: 'Overhead Press', sets: 3 },
          { exerciseId: 'pullup', name: 'Pull-ups', sets: 3 },
          { exerciseId: 'bicep_curl', name: 'Bicep Curls', sets: 2 },
          { exerciseId: 'tricep_pushdown', name: 'Tricep Pushdown', sets: 2 },
        ],
      },
      {
        id: 'ul_lower1',
        name: 'Lower A',
        exercises: [
          { exerciseId: 'squat', name: 'Squat', sets: 4 },
          { exerciseId: 'romanian_dl', name: 'Romanian Deadlift', sets: 3 },
          { exerciseId: 'leg_press', name: 'Leg Press', sets: 3 },
          { exerciseId: 'leg_curl', name: 'Leg Curls', sets: 3 },
          { exerciseId: 'calf_raise', name: 'Calf Raises', sets: 4 },
        ],
      },
      {
        id: 'ul_upper2',
        name: 'Upper B',
        exercises: [
          { exerciseId: 'incline_db', name: 'Incline Dumbbell Press', sets: 4 },
          { exerciseId: 'cable_row', name: 'Cable Row', sets: 4 },
          { exerciseId: 'db_shoulder', name: 'Dumbbell Shoulder Press', sets: 3 },
          { exerciseId: 'lat_pulldown', name: 'Lat Pulldown', sets: 3 },
          { exerciseId: 'hammer_curl', name: 'Hammer Curls', sets: 2 },
          { exerciseId: 'overhead_ext', name: 'Overhead Extension', sets: 2 },
        ],
      },
      {
        id: 'ul_lower2',
        name: 'Lower B',
        exercises: [
          { exerciseId: 'deadlift', name: 'Deadlift', sets: 4 },
          { exerciseId: 'front_squat', name: 'Front Squat', sets: 3 },
          { exerciseId: 'leg_ext', name: 'Leg Extension', sets: 3 },
          { exerciseId: 'leg_curl', name: 'Leg Curls', sets: 3 },
          { exerciseId: 'calf_raise', name: 'Calf Raises', sets: 4 },
        ],
      },
    ],
  },
  {
    id: 'template_fullbody',
    name: 'Full Body 3x',
    description: 'Great for beginners, 3 days per week',
    days: [
      {
        id: 'fb_day1',
        name: 'Day 1',
        exercises: [
          { exerciseId: 'squat', name: 'Squat', sets: 3 },
          { exerciseId: 'bench_press', name: 'Bench Press', sets: 3 },
          { exerciseId: 'barbell_row', name: 'Barbell Row', sets: 3 },
          { exerciseId: 'ohp', name: 'Overhead Press', sets: 2 },
          { exerciseId: 'bicep_curl', name: 'Bicep Curls', sets: 2 },
        ],
      },
      {
        id: 'fb_day2',
        name: 'Day 2',
        exercises: [
          { exerciseId: 'deadlift', name: 'Deadlift', sets: 3 },
          { exerciseId: 'incline_db', name: 'Incline Dumbbell Press', sets: 3 },
          { exerciseId: 'pullup', name: 'Pull-ups', sets: 3 },
          { exerciseId: 'lateral_raise', name: 'Lateral Raises', sets: 2 },
          { exerciseId: 'tricep_pushdown', name: 'Tricep Pushdown', sets: 2 },
        ],
      },
      {
        id: 'fb_day3',
        name: 'Day 3',
        exercises: [
          { exerciseId: 'front_squat', name: 'Front Squat', sets: 3 },
          { exerciseId: 'db_bench', name: 'Dumbbell Bench Press', sets: 3 },
          { exerciseId: 'cable_row', name: 'Cable Row', sets: 3 },
          { exerciseId: 'face_pull', name: 'Face Pulls', sets: 2 },
          { exerciseId: 'hammer_curl', name: 'Hammer Curls', sets: 2 },
        ],
      },
    ],
  },
];

export const COMMON_EQUIPMENT = [
  { id: 'barbell', name: 'Barbell', category: 'free_weights' },
  { id: 'dumbbells', name: 'Dumbbells', category: 'free_weights' },
  { id: 'ez_bar', name: 'EZ Curl Bar', category: 'free_weights' },
  { id: 'bench_flat', name: 'Flat Bench', category: 'benches' },
  { id: 'bench_incline', name: 'Incline Bench', category: 'benches' },
  { id: 'squat_rack', name: 'Squat Rack', category: 'racks' },
  { id: 'power_rack', name: 'Power Rack', category: 'racks' },
  { id: 'smith_machine', name: 'Smith Machine', category: 'machines' },
  { id: 'cable_machine', name: 'Cable Machine', category: 'machines' },
  { id: 'lat_pulldown', name: 'Lat Pulldown Machine', category: 'machines' },
  { id: 'leg_press', name: 'Leg Press Machine', category: 'machines' },
  { id: 'leg_curl', name: 'Leg Curl Machine', category: 'machines' },
  { id: 'leg_ext', name: 'Leg Extension Machine', category: 'machines' },
  { id: 'chest_press', name: 'Chest Press Machine', category: 'machines' },
  { id: 'pullup_bar', name: 'Pull-up Bar', category: 'bodyweight' },
  { id: 'dip_station', name: 'Dip Station', category: 'bodyweight' },
];
