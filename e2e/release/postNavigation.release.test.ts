import {by, device, element, expect} from 'detox';
import {DETOX_DEV_MNEMONIC} from '../__mocks__/E2EVariableMocks';
import {
  navigateThroughOnboarding,
  navigateToPost,
  selectAndConfirmPassword,
  selectAndImportMnemonic,
  selectProfile,
} from '../utils';
import launchAppConfig from '../config';

describe('Post navigation flow', () => {
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

  // TODO:Not working cause reactions are not optimistic
  it('Navigate to a post', async () => {
    await navigateToPost(0);
  });

  //TODO follow/unfollow tests
});
