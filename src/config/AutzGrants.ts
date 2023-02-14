import {
  MsgAddPostAttachmentTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';

export const MsgExecuteContractTypeUrl = '/cosmwasm.wasm.v1.MsgExecuteContract';

export const RequiredAuthzGrants = [
  // Follow unfollow permissions
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  // Post permissions
  MsgAddPostAttachmentTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgCreatePostTypeUrl,
  // Contract execution permission
  MsgExecuteContractTypeUrl,
  // Editing profile permission
  MsgSaveProfileTypeUrl,
];
