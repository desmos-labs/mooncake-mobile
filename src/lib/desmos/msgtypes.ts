// MVP grant list: https://forbole.atlassian.net/browse/DFP-331?focusedCommentId=13674
export enum GrantEnums {
  // see desmjs/build/encodeObjects
  MsgCreatePost = '/desmos.posts.v2.MsgCreatePost',

  // follow/unfollow
  MsgCreateRelationship = '/desmos.relationships.v1.MsgCreateRelationship',
  MsgDeleteRelationship = '/desmos.relationships.v1.MsgDeleteRelationship',

  MsgAddReaction = '/desmos.reactions.v1.MsgAddReaction',
  MsgRemoveReaction = '/desmos.reactions.v1.MsgRemoveReaction',

  MsgCreateReport = '/desmos.reports.v1.AminoMsgCreateReport',
}

export enum GenericMsgEnums {
  MsgSend = '/cosmos.bank.v1beta1.MsgSend',
  MsgMultiSend = '/cosmos.bank.v1beta1.MsgMultiSend',
  MsgWithdrawDelegatorReward = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  MsgVote = '/cosmos.gov.v1beta1.MsgVote',
  MsgDelegate = '/cosmos.staking.v1beta1.MsgDelegate',
  MsgSaveProfile = '/desmos.profiles.v3.MsgSaveProfile',
  MsgLinkChainAccount = '/desmos.profiles.v3.MsgLinkChainAccount',
  MsgUnlinkChainAccount = '/desmos.profiles.v3.MsgUnlinkChainAccount',

  MsgGrant = '/cosmos.authz.v1beta1.MsgGrant',
}

type MsgTypes = GrantEnums | GenericMsgEnums;

export default MsgTypes;
