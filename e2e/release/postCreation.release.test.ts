import {by, device, element, expect} from 'detox';
import {
  DETOX_DEV_ACCOUNT_NICKNAME,
  DETOX_DEV_MNEMONIC,
} from '../__mocks__/E2EVariableMocks';
import launchAppConfig from '../config';

describe('Post creation flow', () => {
  it('Import an account', async () => {
    await device.launchApp(launchAppConfig);
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
    await element(by.id('mnemonicInput')).typeText(DETOX_DEV_MNEMONIC);
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
    // Select profile
    await expect(element(by.text('Select a Profile'))).toBeVisible();
    await expect(element(by.text(DETOX_DEV_ACCOUNT_NICKNAME))).toBeVisible();
    await element(by.text(DETOX_DEV_ACCOUNT_NICKNAME)).tap();
    // Expect to be inside the homescreen
    await expect(element(by.id('homeView'))).toBeVisible();
  });

  it('Create a text post', async () => {
    const postText = `Automated post creation with Detox + ${Math.random()}`;
    // Expect to be inside the homescreen
    await element(by.id('createPostButton')).tap();
    await element(by.id('postText')).tap();
    await element(by.id('postText')).typeText(postText);
    await element(by.id('postButton')).tap();
    // Waiting the chain, after a working GQL mock this timeout should be removed
    await expect(element(by.text(postText))).toBeVisible();
    await waitFor(element(by.id('pendingIndicator')))
      .not.toBeVisible()
      .withTimeout(30000);
    await expect(element(by.id('pendingIndicator'))).not.toBeVisible();
  });

  it('Create a second text post', async () => {
    const postText = `Automated post creation with Detox + ${Math.random()}`;
    // Expect to be inside the homescreen
    await element(by.id('createPostButton')).tap();
    await element(by.id('postText')).tap();
    await element(by.id('postText')).typeText(postText);
    await element(by.id('postButton')).tap();
    // Waiting the chain, after a working GQL mock this timeout should be removed
    await expect(element(by.text(postText))).toBeVisible();
    await waitFor(element(by.id('pendingIndicator')))
      .not.toBeVisible()
      .withTimeout(30000);
    await expect(element(by.id('pendingIndicator'))).not.toBeVisible();
  });
});
