import {
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';

export const MsgExecuteContractTypeUrl = '/cosmwasm.wasm.v1.MsgExecuteContract';

export const RequiredMessageTypesGrant = [
  // Profiles
  MsgSaveProfileTypeUrl,

  // Relationships
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,

  // Post permissions
  MsgCreatePostTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgDeletePostTypeUrl,

  // Reactions
  MsgAddReactionTypeUrl,
  MsgRemoveReactionTypeUrl,

  // Reports
  MsgCreateReportTypeUrl,

  // Contract execution permission
  MsgExecuteContractTypeUrl,
];
