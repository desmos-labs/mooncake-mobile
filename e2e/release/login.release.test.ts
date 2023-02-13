import {by, device, element, expect} from 'detox';
import {
  DETOX_DEV_BLANK_MNEMONIC,
  DETOX_DEV_MNEMONIC,
  DETOX_MOCK_ACCOUNT,
} from '../__mocks__/E2EVariableMocks';
import launchAppConfig from '../config';
import {MockGraphQLServer} from '../__mocks__/MockGraphQLServer';

const mocks = {
  query_root: () => ({
    profile: () => [DETOX_MOCK_ACCOUNT],
  }),
  bigint: () => 1,
  timestamp: () => '2023-02-13T10:26:48Z',
};

const server = MockGraphQLServer.createServerWithMocks(mocks);

describe('Login flow', () => {
  beforeAll(() => {
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });

  beforeEach(async () => {
    // Make sure to clean the app
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp(launchAppConfig);
  });

  it('Goes through the login flow, inserting a mnemonic and a password, selecting a profile, reaching the home screen correctly', async () => {
    // e2e test will try to find this nickname on the SelectDTag screen
    const {nickname} = DETOX_MOCK_ACCOUNT;
    const mockPassword = 'this is my password';

    // Onboarding
    await element(by.text('Skip')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
    await expect(element(by.text('Sign up'))).toBeVisible();
    await expect(
      element(by.text('Import Secret Recovery Phrase')),
    ).toBeVisible();
    await element(by.text('Import Secret Recovery Phrase')).tap();
    // Mnemonic
    await expect(element(by.text('Recovery Phrase'))).toBeVisible();
    await expect(element(by.id('mnemonicInput'))).toBeVisible();
    // await element(by.id('mnemonicInput')).tap();
    // await element(by.id('mnemonicInput')).typeText('i must not work');
    // await element(by.id('loginCheckbox')).tap();
    // await element(by.text('Next')).tap();
    // await expect(element(by.text('Clear all'))).toBeVisible();
    // await element(by.text('Clear all')).tap();
    await element(by.id('mnemonicInput')).tap();
    await element(by.id('mnemonicInput')).typeText(DETOX_DEV_MNEMONIC);
    await element(by.id('loginCheckbox')).tap();
    await element(by.text('Next')).tap();
    // Password
    await expect(element(by.text('Set Up Password'))).toBeVisible();
    await expect(element(by.id('newPasswordField'))).toBeVisible();
    await expect(element(by.id('confirmPasswordField'))).toBeVisible();
    await element(by.id('newPasswordField')).tap();
    await element(by.id('newPasswordField')).typeText(mockPassword);
    await element(by.id('confirmPasswordField')).tap();
    await element(by.id('confirmPasswordField')).typeText(mockPassword);
    await element(by.text('Next')).tap();
    // Select profile
    await expect(element(by.text('Select a Profile'))).toBeVisible();
    await expect(element(by.text(nickname))).toBeVisible();
    await element(by.text(nickname)).tap();
    // Expect to be inside the homescreen
    await expect(element(by.id('homeView'))).toBeVisible();
  });

  it('Goes through the login flow, inserting a mnemonic and a password, expecting no profiles available', async () => {
    // Onboarding
    await element(by.text('Skip')).tap();
    await expect(element(by.text('Butter'))).toBeVisible();
    await expect(
      element(by.text('Your decentralized social network')),
    ).toBeVisible();
    await expect(element(by.text('Sign up'))).toBeVisible();
    await expect(
      element(by.text('Import Secret Recovery Phrase')),
    ).toBeVisible();
    await element(by.text('Import Secret Recovery Phrase')).tap();
    // Mnemonic
    await expect(element(by.text('Recovery Phrase'))).toBeVisible();
    await expect(element(by.id('mnemonicInput'))).toBeVisible();
    await element(by.id('mnemonicInput')).tap();
    await element(by.id('mnemonicInput')).typeText(DETOX_DEV_BLANK_MNEMONIC);
    await element(by.id('loginCheckbox')).tap();
    await element(by.text('Next')).tap();
    // Password
    await expect(element(by.text('Set Up Password'))).toBeVisible();
    await expect(element(by.id('newPasswordField'))).toBeVisible();
    await expect(element(by.id('confirmPasswordField'))).toBeVisible();
    await element(by.id('newPasswordField')).tap();
    await element(by.id('newPasswordField')).typeText('this is my password');
    await element(by.id('confirmPasswordField')).tap();
    await element(by.id('confirmPasswordField')).typeText(
      'this is my password',
    );
    await element(by.text('Next')).tap();
    // Expect no profiles are available
    await expect(element(by.text('Create a Desmos Profile'))).toBeVisible();
    // TODO add more cases
  });
});
