import {by, element, expect} from 'detox';
import {DETOX_DEV_ACCOUNT_NICKNAME} from './__mocks__/E2EVariableMocks';

/**
 * Utility function to test the onboarding screens
 */
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

/**
 * Utility function to test the mnemonic import
 * @param mnemonic desired mnemonic to import
 */
export const selectAndImportMnemonic = async (mnemonic: string) => {
  await expect(element(by.text('Recovery Phrase'))).toBeVisible();
  await expect(element(by.id('mnemonicInput'))).toBeVisible();
  await element(by.id('mnemonicInput')).tap();
  await element(by.id('mnemonicInput')).typeText(mnemonic);
  await element(by.id('loginCheckbox')).tap();
  await element(by.text('Next')).tap();
};

/**
 * Utility function to test the fail mnemonic import
 */
export const selectAndImportIncorrectMnemonic = async () => {
  await expect(element(by.text('Recovery Phrase'))).toBeVisible();
  await expect(element(by.id('mnemonicInput'))).toBeVisible();
  await element(by.id('mnemonicInput')).typeText('i must not work');
  await element(by.id('loginCheckbox')).tap();
  await element(by.text('Next')).tap();
  await expect(element(by.text('Clear all'))).toBeVisible();
  await element(by.text('Clear all')).tap();
};

/**
 * Utility function to test the password setup
 */
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

/**
 * Utility function to select a profile inside the import flow
 */
export const selectProfile = async () => {
  await expect(element(by.text('Select a Profile'))).toBeVisible();
  await expect(element(by.text(DETOX_DEV_ACCOUNT_NICKNAME))).toBeVisible();
  await element(by.text(DETOX_DEV_ACCOUNT_NICKNAME)).tap();
};

/**
 * Utility function to create a random text post
 */
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

/**
 * Utility function to like a post
 * @param index the index of the post
 */
export const likeHomeTextPost = async (index: number) => {
  await expect(element(by.id('homeView'))).toBeVisible();
  await expect(element(by.id('postCard')).atIndex(0)).toBeVisible();
  await element(by.id('postcardAddLikeButton').withAncestor(by.id('postCard')))
    .atIndex(index)
    .tap();
  await waitFor(element(by.text('postcardRemoveLikeButton')).atIndex(index))
    .toBeVisible()
    .withTimeout(500);
};

/**
 * Utility function to remove a like from a post
 * @param index the index of the post
 */
export const unlikeHomeTextPost = async (index: number) => {
  await expect(element(by.id('homeView'))).toBeVisible();
  await expect(element(by.id('postCard')).atIndex(0)).toBeVisible();
  await element(
    by.id('postcardRemoveLikeButton').withAncestor(by.id('postCard')),
  )
    .atIndex(index)
    .tap();
  await waitFor(element(by.text('postcardAddLikeButton')).atIndex(index))
    .toBeVisible()
    .withTimeout(500);
};

/**
 * Utility function to navigate to a post details screen
 * @param index the index of the post
 */
export const navigateToPost = async (index: number) => {
  //TODO check more strictly if we are navigating to the post. Will be possible with mocks
  await expect(element(by.id('homeView'))).toBeVisible();
  await expect(element(by.id('postCard')).atIndex(index)).toBeVisible();
  // Workaround because detox is finding more elements
  // TODO: figure this out, atIndex not working with getAttributes
  const multipleMatchedElements = await element(
    by.id('homePostText'),
  ).getAttributes();
  // @ts-ignore
  console.log(multipleMatchedElements.elements[index].text);
  await element(by.id('postCard')).atIndex(index).tap();
  await expect(element(by.id('postDetailsScreen'))).toBeVisible();
  await expect(
    // @ts-ignore
    element(by.text(multipleMatchedElements.elements[index].text)),
  ).toBeVisible();
  await element(by.label('back-button')).tap();
};
