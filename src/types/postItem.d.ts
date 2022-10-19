import {Media, Poll} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';

export {};

// TODO: replace this with POST type from desmjs
declare global {
  interface PostItem {
    isPending?: boolean;

    author_address: string;

    author: PostAuthor;

    subspace_id: number;

    reactions: any[];

    tips: any[];

    attachments: PostAttachment[];

    text: string;

    id: number;

    creation_date: string;

    conversation: any;

    repliesCount: {
      aggregate: {
        count: number;
      };
    };
    reactionPresence: {
      aggregate: {
        count: number;
      };
    };
    tipPresence: {
      aggregate: {
        count: number;
      };
    };
    commentPresence: {
      aggregate: {
        count: number;
      };
    };
  }

  interface PostAuthor {
    address: string;
    bio: string;
    dtag: string;
    profile_pic: string;
    nickname: string;
  }

  interface PostAttachment {
    id: number;

    content: Media | Poll;
  }

  interface MediaContent {
    uri: string;
    '@type': string;
    mime_type: string;
  }

  interface PollContent {
    '@type': string;
    end_date: string;
    question: string;
    provided_answers: {
      text: string;
      attachments: PostAttachment[];
    }[];
    allows_answer_edits: boolean;
    final_tally_results: any;
    allows_multiple_answers: boolean;
  }
}
