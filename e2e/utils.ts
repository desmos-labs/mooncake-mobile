import {by, element, expect} from 'detox';
import {DETOX_DEV_ACCOUNT_NICKNAME} from './__mocks__/E2EVariableMocks';

// Utility function to test the onboarding screens
export const navigateThroughOnboarding = async () => {
  await element(by.text('Skip')).tap();
  await expect(element(by.text('Butter'))).toBeVisible();
  await expect(
    element(by.text('Your decentralized social network')),
  ).toBeVisible();
  await expect(element(by.text('Sign up'))).toBeVisible();
  await expect(element(by.text('Import Secret Recovery Phrase'))).toBeVisible();
  await element(by.text('Import Secret Recovery Phrase')).tap();
};

// Utility function to test the mnemonic import
export const selectAndImportMnemonic = async (mnemonic: string) => {
  await expect(element(by.text('Recovery Phrase'))).toBeVisible();
  await expect(element(by.id('mnemonicInput'))).toBeVisible();
  await element(by.id('mnemonicInput')).tap();
  await element(by.id('mnemonicInput')).typeText(mnemonic);
  await element(by.id('loginCheckbox')).tap();
  await element(by.text('Next')).tap();
};

// Utility function to test the fail mnemonic import
export const selectAndImportIncorrectMnemonic = async () => {
  await expect(element(by.text('Recovery Phrase'))).toBeVisible();
  await expect(element(by.id('mnemonicInput'))).toBeVisible();
  await element(by.id('mnemonicInput')).typeText('i must not work');
  await element(by.id('loginCheckbox')).tap();
  await element(by.text('Next')).tap();
  await expect(element(by.text('Clear all'))).toBeVisible();
  await element(by.text('Clear all')).tap();
};

// Utility function to test the password selection
export const selectAndConfirmPassword = async () => {
  await expect(element(by.text('Set Up Password'))).toBeVisible();
  await expect(element(by.id('newPasswordField'))).toBeVisible();
  await expect(element(by.id('confirmPasswordField'))).toBeVisible();
  await element(by.id('newPasswordField')).tap();
  await element(by.id('newPasswordField')).typeText('this is my password');
  await element(by.id('confirmPasswordField')).tap();
  await element(by.id('confirmPasswordField')).typeText('this is my password');
  await element(by.text('Next')).tap();
};

// Utility function to select a profile inside the import flow
export const selectProfile = async () => {
  await expect(element(by.text('Select a Profile'))).toBeVisible();
  await expect(element(by.text(DETOX_DEV_ACCOUNT_NICKNAME))).toBeVisible();
  await element(by.text(DETOX_DEV_ACCOUNT_NICKNAME)).tap();
};

// Utility function to create a random text post
export const createTextPost = async () => {
  // Random text
  const postText = `Automated post creation with Detox + ${Math.random()}`;
  // Expect to be inside the homescreen
  await element(by.id('createPostButton')).tap();
  await element(by.id('postText')).tap();
  await element(by.id('postText')).typeText(postText);
  await element(by.id('postButton')).tap();
  await expect(element(by.text(postText))).toBeVisible();
  // Waiting the chain, after a working GQL mock this timeout should be removed
  await waitFor(element(by.id('pendingIndicator')))
    .not.toBeVisible()
    .withTimeout(30000);
  await expect(element(by.id('pendingIndicator'))).not.toBeVisible();
};
