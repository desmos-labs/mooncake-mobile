describe('App first launch should display welcome screen.', () => {
  beforeEach(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
        faceid: 'YES',
      },
      newInstance: true,
    });
  });

  it('Welcome screen should be shown', async () => {
    await expect(element(by.text('Welcome to Butter'))).toBeVisible();
  });
});
