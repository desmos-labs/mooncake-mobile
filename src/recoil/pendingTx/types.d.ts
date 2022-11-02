import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  MsgCreatePostEncodeObject,
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';

export {};

declare global {
  interface BasePendingTx {
    msgType: GrantEnums;

    timestamp: number;

    txHash: string;

    msg:
      | MsgCreatePostEncodeObject
      | MsgCreateRelationshipEncodeObject
      | MsgDeleteRelationshipEncodeObject;
  }

  interface PendingRelationship extends BasePendingTx {
    counterPartyAddr: string;

    msgType: string;

    msg: MsgCreateRelationshipEncodeObject | MsgDeleteRelationshipEncodeObject;
  }

  interface PendingPost extends BasePendingTx {
    postData: Partial<PostItem> & Pick<PostItem, 'id'>;

    // save the msg encode object for retry
    msg: MsgCreatePostEncodeObject;
  }

  type PendingTx = PendingRelationship | PendingPost;
}
