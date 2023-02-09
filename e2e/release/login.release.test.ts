import {by, device, element, expect} from 'detox';
import launchAppConfig from '../config';
import {
  navigateThroughOnboarding,
  selectAndConfirmPassword,
  selectAndImportIncorrectMnemonic,
  selectAndImportMnemonic,
  selectProfile,
} from '../utils';
import {
  DETOX_DEV_BLANK_MNEMONIC,
  DETOX_DEV_MNEMONIC,
} from '../__mocks__/E2EVariableMocks';

describe('Login flow', () => {
  /**
   * We need to make sure the app is cleaned before doing this test, otherwise it will fail
   */
  beforeEach(async () => {
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp(launchAppConfig);
  });

  it('Goes through the login flow, inserting an incorrect mnemonic ', async () => {
    // Onboarding
    await navigateThroughOnboarding();
    // Mnemonic
    await selectAndImportIncorrectMnemonic();
  });

  it('Goes through the login flow, inserting a mnemonic and a password, selecting a profile, reaching the home screen correctly', async () => {
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

  it('Goes through the login flow, inserting a mnemonic and a password, expecting no profiles available', async () => {
    // Onboarding
    await navigateThroughOnboarding();
    // Mnemonic
    await selectAndImportMnemonic(DETOX_DEV_BLANK_MNEMONIC);
    // Password
    await selectAndConfirmPassword();
    // Expect no profiles are available
    await expect(element(by.text('Create a Desmos Profile'))).toBeVisible();
  });
});
