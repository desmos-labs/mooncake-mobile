import {atom, DefaultValue, selector} from 'recoil';
import {UploadAssetType} from 'services/axios/requests/UploadMedia';

export const signUpDTagState = atom<string>({
  key: 'signUpDTagState',
  default: '',
});

export const signUpNicknameState = atom<string>({
  key: 'signUpNicknameState',
  default: '',
});

export const signUpBioState = atom<string>({
  key: 'signUpBioState',
  default: '',
});

export const signUpCoverPicState = atom<UploadAssetType | undefined>({
  key: 'signUpBannerState',
  default: undefined,
});

export const signUpProfilePicState = atom<UploadAssetType | undefined>({
  key: 'signUpAvatarState',
  default: undefined,
});

const signUpInfoState = selector({
  key: 'signUpInfoState',
  get: ({get}) => {
    return {
      dTag: get(signUpDTagState),
      nickname: get(signUpNicknameState),
      bio: get(signUpBioState),
      coverPicture: get(signUpCoverPicState),
      profilePicture: get(signUpProfilePicState),
    };
  },
  set: ({set}, value) => {
    if (value instanceof DefaultValue) {
      set(signUpDTagState, value);
      set(signUpNicknameState, value);
      set(signUpBioState, value);
      set(signUpCoverPicState, value);
      set(signUpProfilePicState, value);
      return;
    }
    set(signUpDTagState, value.dTag);
    set(signUpNicknameState, value.nickname);
    set(signUpBioState, value.bio);
    set(signUpCoverPicState, value.coverPicture);
    set(signUpProfilePicState, value.profilePicture);
  },
});

export default signUpInfoState;
