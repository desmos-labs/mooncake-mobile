import {atom} from 'recoil';

/**
 * Recoil atom for the invite code
 */
const inviteCodeState = atom<string>({
  key: 'inviteCode',
  default: '',
});

export default inviteCodeState;
