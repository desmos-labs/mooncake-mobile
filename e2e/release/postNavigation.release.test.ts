import {device} from 'detox';
import {
  DETOX_DEV_ACCOUNT_NICKNAME,
  DETOX_DEV_MNEMONIC,
} from '../__mocks__/E2EVariableMocks';
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
    await selectProfile(DETOX_DEV_ACCOUNT_NICKNAME);
  });

  it('Navigate to a post with index 0', async () => {
    await navigateToPost(0);
  });

  it('Navigate to a post with index 1', async () => {
    await navigateToPost(1);
  });
});
