import {
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';

export const MsgExecuteContractTypeUrl = '/cosmwasm.wasm.v1.MsgExecuteContract';

export const RequiredMessageTypesGrant = [
  // Editing profile permission
  MsgSaveProfileTypeUrl,
  // Post permissions
  MsgCreatePostTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgDeletePostTypeUrl,
  // Follow unfollow permissions
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  // Reactions
  MsgAddReactionTypeUrl,
  MsgRemoveReactionTypeUrl,
  // Contract execution permission
  MsgExecuteContractTypeUrl,
];
