import {GrantEnums} from 'lib/desmos/msgtypes';
import {MsgCreatePostEncodeObject} from '@desmoslabs/desmjs';

export {};

declare global {
  interface BasePendingTx {
    msgType: GrantEnums;

    timestamp: number;

    txHash: string;
  }

  interface PendingRelationship extends BasePendingTx {
    counterPartyAddr: string;

    msgType:
      | GrantEnums.MsgCreateRelationship
      | GrantEnums.MsgDeleteRelationship;
  }

  interface PendingPost extends BasePendingTx {
    postData: Partial<PostItem> & Pick<PostItem, 'id'>;

    // save the msg encode object for retry
    msg: MsgCreatePostEncodeObject;
  }

  type PendingTx = PendingRelationship | PendingPost;
}
