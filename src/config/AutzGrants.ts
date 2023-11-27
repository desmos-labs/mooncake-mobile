import {
  MsgAddPostAttachmentTypeUrl,
  MsgCreatePostTypeUrl,
  MsgDeletePostTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
} from '@desmoslabs/desmjs/build/modules/posts/v3';
import { MsgSaveProfileTypeUrl } from '@desmoslabs/desmjs/build/modules/profiles/v3';
import {
  MsgAddReactionTypeUrl,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs/build/modules/reactions/v1';
import {
  MsgBlockUserTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgUnblockUserTypeUrl,
} from '@desmoslabs/desmjs/build/modules/relationships/v1';
import { MsgCreateReportTypeUrl } from '@desmoslabs/desmjs/build/modules/reports/v1';

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

  // Block/Unblock
  MsgBlockUserTypeUrl,
  MsgUnblockUserTypeUrl,
];
