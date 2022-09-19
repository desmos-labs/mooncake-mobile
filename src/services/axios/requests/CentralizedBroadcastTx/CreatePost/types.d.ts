import {PostReference} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';

export {};

// TODO: use types from desmjs instead
declare global {
  type CreatePostParams = {
    text: string;

    conversationId?: number;

    postReferences?: PostReference[];
  };
}
