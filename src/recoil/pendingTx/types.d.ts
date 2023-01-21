import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  MsgCreatePostEncodeObject,
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import {PendingPostEnum} from '@recoil/pendingTx/pendingPosts';

export {};

declare global {
  interface BasePendingTx {
    msgType: GrantEnums;

    timestamp: number;

    postType: PendingPostEnum;

    msg:
      | MsgCreatePostEncodeObject
      | MsgCreateRelationshipEncodeObject
      | MsgDeleteRelationshipEncodeObject;
  }

  interface PendingPost extends BasePendingTx {
    postData: Partial<PostItem> & Pick<PostItem, 'id'>;

    // save the msg encode object for retry
    msg: MsgCreatePostEncodeObject;
  }

  type PendingTx = PendingRelationship | PendingPost;
}
