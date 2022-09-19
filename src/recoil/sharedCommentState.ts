import {atom, DefaultValue, selector} from 'recoil';
import {UploadAssetType} from 'services/axios/requests/UploadMedia';

export const commentTextState = atom<string>({
  key: 'commentTextState',
  default: '',
});

export const commentAttachmentsState = atom<UploadAssetType | undefined>({
  key: 'commentAttachmentsState',
  default: undefined,
});

/**
 * Atom to persist user's entered comments when switching between
 * fullscreen and bottom bar comment entry
 */
const sharedCommentState = selector({
  key: 'sharedCommentState',
  get: ({get}) => {
    return {
      commentText: get(commentTextState),
      commentAttachments: get(commentAttachmentsState),
    };
  },
  set: ({set}, value) => {
    if (value instanceof DefaultValue) {
      set(commentTextState, value);
      set(commentAttachmentsState, value);
      return;
    }
    set(commentTextState, value.commentText);
    set(commentAttachmentsState, value.commentAttachments);
  },
});

export default sharedCommentState;
