describe('Debug to Landing Test', () => {
  beforeEach(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
        faceid: 'YES',
      },
      newInstance: true,
    });
  });

  it('should tap on button by id and expect some text to be visible', async () => {
    await element(by.id('ContinueToLanding')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
  });
});
