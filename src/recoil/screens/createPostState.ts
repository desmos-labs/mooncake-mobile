import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { UploadAssetType } from 'services/axios/requests/UploadMedia';
import React from 'react';
import { Entities, ReplySetting } from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { PostReference } from 'types/posts';

/**
 * Represents the state of the screen that allows to create a post.
 */
export interface CreatePostState {
  /**
   * ID of the section inside which this post has been created.
   * Default to `0` if not set.
   */
  readonly sectionId?: number;

  /**
   * Post text input by the user.
   */
  readonly text: string;

  /**
   * Any attachment (video, image, etc) associated to the post.
   */
  readonly attachments: UploadAssetType[];

  /**
   * Tags associated to the post, if any.
   */
  readonly tags: string[];

  /**
   * Entities associated to the post, if any.
   */
  readonly entities: Entities | undefined;

  /**
   * Posts referenced by this post.
   */
  readonly referencedPosts: PostReference[];

  /**
   * Reply settings of the post.
   */
  readonly replySettings: ReplySetting;
}

/**
 * Default state of the screen allowing to create a post.
 */
const DefaultCreatePostState: CreatePostState = {
  sectionId: 0,
  text: '',
  attachments: [],
  tags: [],
  entities: undefined,
  referencedPosts: [],
  replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
};

/**
 * Atom to persist user's entered comments when switching between
 * fullscreen and bottom bar comment entry
 */
const createPostState = atom<CreatePostState>({
  key: 'createPostState',
  default: DefaultCreatePostState,
});

/**
 * Hook that allows to observe the {@link CreatePostState} atom.
 */
export const useCreatePostState = () => useRecoilValue(createPostState);

/**
 * Recoil that allows to select a single {@link CreatePostState} value.
 */
const createPostStateValue = selectorFamily({
  key: 'createPostStateValue',
  get:
    (key: keyof CreatePostState) =>
    ({ get }) => {
      const settings = get(createPostState);
      return settings[key];
    },
});

/**
 * Hook that allows to observe only a single {@link CreatePostState} value.
 * @param valueKey - Key associated to the value that needs to be retrieved.
 * @return The value of the state associated with the given key.
 */
export const useCreatePostValue = <K extends keyof CreatePostState>(valueKey: K) =>
  useRecoilValue(createPostStateValue(valueKey)) as CreatePostState[K];

/**
 * Hook that provides a function to update the value of a single {@link CreatePostState} field.
 * @param valueKey - Key of the value of interest.
 */
export const useSetCreatePostValue = <K extends keyof CreatePostState>(valueKey: K) => {
  const setCreatePostState = useSetRecoilState(createPostState);
  return React.useCallback(
    (value: CreatePostState[K]) => {
      setCreatePostState(currentValue => {
        const values: CreatePostState = {
          ...currentValue,
        };
        values[valueKey] = value;
        return values;
      });
    },
    [valueKey, setCreatePostState],
  );
};

/**
 * Hook that allows to add a post attachments to the create post state.
 */
export const useAddCreatePostAttachment = () => {
  const setCreatePostState = useSetRecoilState(createPostState);
  return React.useCallback(
    (attachment: UploadAssetType) => {
      setCreatePostState(state => {
        const attachments = state.attachments ?? [];
        if (!attachments.some(a => a === attachment)) {
          attachments.push(attachment);
        }

        return {
          ...state,
          attachments,
        };
      });
    },
    [setCreatePostState],
  );
};

/**
 * Hook that allows to remove an attachment from the create post state.
 */
export const useRemoveCreatePostAttachment = () => {
  const setCreatePostState = useSetRecoilState(createPostState);
  return React.useCallback(
    (attachment: UploadAssetType) => {
      setCreatePostState(state => {
        const attachments = state.attachments?.filter(a => a !== attachment);
        return {
          ...state,
          attachments,
        };
      });
    },
    [setCreatePostState],
  );
};

/**
 * Hook that allows to reset the current state of the post creation screen.
 */
export const useResetCreatePostState = () => {
  const setCreatePostState = useSetRecoilState(createPostState);
  return React.useCallback(() => {
    setCreatePostState(DefaultCreatePostState);
  }, [setCreatePostState]);
};
