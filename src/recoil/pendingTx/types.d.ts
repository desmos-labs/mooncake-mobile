import {GrantEnums} from 'lib/desmos/msgtypes';

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
    postData: PostItem;
  }

  type PendingTx = PendingRelationship | PendingPost;
}
