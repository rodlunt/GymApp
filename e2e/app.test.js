describe('Clean Reps App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Home Screen', () => {
    it('should show the home screen on launch', async () => {
      // Check for main navigation tabs
      await expect(element(by.text('Workout'))).toBeVisible();
      await expect(element(by.text('Routines'))).toBeVisible();
      await expect(element(by.text('Progress'))).toBeVisible();
      await expect(element(by.text('Settings'))).toBeVisible();
    });

    it('should navigate to workout tab', async () => {
      await element(by.text('Workout')).tap();
      // Add assertions for workout screen content
      await expect(element(by.text('Start Workout'))).toBeVisible();
    });
  });

  describe('Navigation', () => {
    it('should navigate to Routines tab', async () => {
      await element(by.text('Routines')).tap();
      await expect(element(by.text('My Routines'))).toBeVisible();
    });

    it('should navigate to Progress tab', async () => {
      await element(by.text('Progress')).tap();
      await expect(element(by.text('Progress'))).toBeVisible();
    });

    it('should navigate to Settings tab', async () => {
      await element(by.text('Settings')).tap();
      await expect(element(by.text('Settings'))).toBeVisible();
    });
  });

  describe('Workout Flow', () => {
    it('should start a new workout', async () => {
      await element(by.text('Workout')).tap();
      await element(by.text('Start Workout')).tap();
      // Verify active workout screen appears
      await expect(element(by.text('Active Workout'))).toBeVisible();
    });

    it('should be able to add an exercise', async () => {
      await element(by.text('Workout')).tap();
      await element(by.text('Start Workout')).tap();
      await element(by.text('Add Exercise')).tap();
      // Verify exercise picker appears
      await expect(element(by.text('Select Exercise'))).toBeVisible();
    });
  });

  describe('Routine Management', () => {
    it('should create a new routine', async () => {
      await element(by.text('Routines')).tap();
      await element(by.text('Create Routine')).tap();
      // Verify create routine screen
      await expect(element(by.text('New Routine'))).toBeVisible();
    });
  });
});
