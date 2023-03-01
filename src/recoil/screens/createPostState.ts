import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { UploadAssetType } from 'services/axios/requests/UploadMedia';
import React from 'react';
import { ReplySetting } from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { Post } from 'types/posts';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents the state of the screen that allows to create a post.
 */
export interface CreatePostState
  extends Omit<
    Post,
    | 'status'
    | 'statusUpdateDate'
    | 'subspaceId'
    | 'sectionId'
    | 'id'
    | 'text'
    | 'attachments'
    | 'creationDate'
    | 'transactions'
    | 'author'
  > {
  /**
   * ID of the subspace section inside which this post has been created.
   *
   * <b>Note</b>: Currently Butter does not support sections.
   * We should make sure to set this to the proper value if it ever does
   */
  readonly sectionId: number | undefined;

  /**
   * Text of the post. This overloads the {@link Post} `text` field so that
   * it cannot be `undefined`.
   */
  readonly text: string;

  /**
   * Any attachment (video, image, etc) associated to the post.
   * This overloads the {@link Post} `attachments` fields as it's a different
   * type of attachments since these need to be uploaded before creating
   * the post on-chain.
   */
  readonly attachments: UploadAssetType[];
}

/**
 * Default state of the screen allowing to create a post.
 * This is a function because we need to generate a random UUID.
 */
const DefaultCreatePostState = (): CreatePostState => ({
  conversationId: 0,
  sectionId: undefined,

  // Generate a random UUID to be used as external ID
  externalId: uuidv4(),

  text: '',
  attachments: [],
  tags: [],
  entities: undefined,
  references: [],
  replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
});

/**
 * Atom to persist user's entered comments when switching between
 * fullscreen and bottom bar comment entry
 */
const createPostState = atom<CreatePostState>({
  key: 'createPostState',
  default: DefaultCreatePostState(),
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
          return {
            ...state,
            attachments: [...attachments, attachment],
          };
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
    setCreatePostState(DefaultCreatePostState());
  }, [setCreatePostState]);
};
