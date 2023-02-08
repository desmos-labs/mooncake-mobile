import {by, device, element, expect} from 'detox';
import {DETOX_DEV_MNEMONIC} from '../__mocks__/E2EVariableMocks';
import {
  createTextPost,
  navigateThroughOnboarding,
  selectAndConfirmPassword,
  selectAndImportMnemonic,
  selectProfile,
} from '../utils';
import launchAppConfig from '../config';

describe('Post creation flow', () => {
  it('Import an account', async () => {
    await device.launchApp(launchAppConfig);
    // Onboarding
    await navigateThroughOnboarding();
    // Mnemonic
    await selectAndImportMnemonic(DETOX_DEV_MNEMONIC);
    // Password
    await selectAndConfirmPassword();
    // Select profile
    await selectProfile();
    // Expect to be inside the homescreen
    await expect(element(by.id('homeView'))).toBeVisible();
  });

  it('Create a text post', async () => {
    // Create a random text post
    await createTextPost();
  });

  it('Create a second text post', async () => {
    // Create a random text post
    await createTextPost();
  });
});
