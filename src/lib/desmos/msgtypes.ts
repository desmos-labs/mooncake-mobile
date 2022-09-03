enum MsgTypes {
  MsgSend = '/cosmos.bank.v1beta1.MsgSend',
  MsgMultiSend = '/cosmos.bank.v1beta1.MsgMultiSend',
  MsgWithdrawDelegatorReward = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  MsgVote = '/cosmos.gov.v1beta1.MsgVote',
  MsgDelegate = '/cosmos.staking.v1beta1.MsgDelegate',
  MsgSaveProfile = '/desmos.profiles.v3.MsgSaveProfile',
  MsgLinkChainAccount = '/desmos.profiles.v3.MsgLinkChainAccount',
  MsgUnlinkChainAccount = '/desmos.profiles.v3.MsgUnlinkChainAccount',
  MsgCreateRelationship = '/desmos.relationships.v1.MsgCreateRelationship',
  MsgDeleteRelationship = '/desmos.relationships.v1.MsgDeleteRelationship',
}

export default MsgTypes;
