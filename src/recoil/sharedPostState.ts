import {atom, DefaultValue, selector} from 'recoil';
import {UploadAssetType} from 'services/axios/requests/UploadMedia';

export const postTextState = atom<string>({
  key: 'postTextState',
  default: '',
});

export const postAttachmentsState = atom<UploadAssetType | undefined>({
  key: 'postAttachmentsState',
  default: undefined,
});

/**
 * Atom to persist user's entered comments when switching between
 * fullscreen and bottom bar comment entry
 */
const sharedPostState = selector({
  key: 'sharedPostState',
  get: ({get}) => {
    return {
      postText: get(postTextState),
      postAttachments: get(postAttachmentsState),
    };
  },
  set: ({set}, value) => {
    if (value instanceof DefaultValue) {
      set(postTextState, value);
      set(postAttachmentsState, value);
      return;
    }
    set(postTextState, value.postText);
    set(postAttachmentsState, value.postAttachments);
  },
});

export default sharedPostState;
