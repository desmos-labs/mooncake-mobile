import {atom} from 'recoil';

/**
 * An atom that holds the user's entered password on signUp/ import so it can
 * be used to auto-login
 */
const signUpPasswordState = atom<string>({
  key: 'signUpPassword',
  default: '',
});

export default signUpPasswordState;
