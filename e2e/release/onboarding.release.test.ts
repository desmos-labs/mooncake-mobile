import {by, device, element, expect} from 'detox';
import launchAppConfig from '../config';

describe('App first launch should display welcome screen.', () => {
  beforeEach(async () => {
    await device.launchApp(launchAppConfig);
  });

  it('Welcome screen should be shown', async () => {
    await expect(element(by.text('Welcome to Butter'))).toBeVisible();
  });

  it('Goes to landing page if the skip button is pressed', async () => {
    await element(by.text('Skip')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
    await expect(element(by.text('Sign Up'))).toBeVisible();
    await expect(
      element(by.text('Import Secret Recovery Phrase')),
    ).toBeVisible();
  });
});
