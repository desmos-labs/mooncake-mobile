import {by, device, element, expect} from 'detox';
import launchAppConfig from '../config';
import {navigateThroughOnboarding} from '../utils';

describe('Onboarding flow', () => {
  beforeEach(async () => {
    await device.launchApp(launchAppConfig);
  });

  it('Welcome screen should be shown', async () => {
    await expect(element(by.text('Welcome to Butter'))).toBeVisible();
  });

  it('Goes to landing page if the skip button is pressed', async () => {
    await navigateThroughOnboarding();
  });

  it('Goes to the landing page if reached the last tab and the Join Butter button is pressed', async () => {
    await expect(element(by.text('Welcome to Butter'))).toBeVisible();
    await element(by.id('onboardingPagerView')).swipe('left');
    await expect(element(by.text('Privacy First'))).toBeVisible();
    await element(by.id('onboardingPagerView')).swipe('left');
    await expect(element(by.text('Free Speech'))).toBeVisible();
    await element(by.id('onboardingPagerView')).swipe('left');
    await expect(element(by.text('Earn Rewards'))).toBeVisible();
    await element(by.text('Join Butter')).tap();
  });
});
