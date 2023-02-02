import {by, device, element, expect} from 'detox';
import launchAppConfig from '../config';

describe('Debug to Landing Test', () => {
  beforeEach(async () => {
    await device.launchApp(launchAppConfig);
  });

  it('should tap on continue to landing button and expect some text and three buttons to be visible', async () => {
    await element(by.id('ContinueToLanding')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
    await expect(element(by.id('landingSignup'))).toBeVisible();
    await expect(element(by.id('landingImport'))).toBeVisible();
    await expect(element(by.id('landingConnectLedger'))).toBeVisible();
  });
});
