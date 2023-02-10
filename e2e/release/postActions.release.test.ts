import {by, device, element, expect} from 'detox';
import {
  DETOX_DEV_ACCOUNT_NICKNAME,
  DETOX_DEV_MNEMONIC,
} from '../__mocks__/E2EVariableMocks';
import {
  likeHomeTextPost,
  navigateThroughOnboarding,
  selectAndConfirmPassword,
  selectAndImportMnemonic,
  selectProfile,
  unlikeHomeTextPost,
} from '../utils';
import launchAppConfig from '../config';

describe('Post actions flow', () => {
  it('Import an account', async () => {
    await device.launchApp(launchAppConfig);
    // Onboarding
    await navigateThroughOnboarding();
    // Mnemonic
    await selectAndImportMnemonic(DETOX_DEV_MNEMONIC);
    // Password
    await selectAndConfirmPassword();
    // Select profile
    await selectProfile(DETOX_DEV_ACCOUNT_NICKNAME);
    // Expect to be inside the homescreen
    await expect(element(by.id('homeView'))).toBeVisible();
  });

  // TODO:Not working cause reactions are not optimistic
  it('Like a post', async () => {
    await likeHomeTextPost(0);
  });

  // TODO:Not working cause reactions are not optimistic
  it('Unlike a post', async () => {
    await unlikeHomeTextPost(0);
  });

  // TODO follow/unfollow tests
});
