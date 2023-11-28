import {
    Posts,
    Profiles,
    Relationships,
    Reactions,
    Reports,
} from '@desmoslabs/desmjs';

export const MsgExecuteContractTypeUrl = '/cosmwasm.wasm.v1.MsgExecuteContract';

export const RequiredMessageTypesGrant = [
    // Profiles
    Profiles.v3.MsgSaveProfileTypeUrl,

    // Relationships
    Relationships.v1.MsgCreateRelationshipTypeUrl,
    Relationships.v1.MsgDeleteRelationshipTypeUrl,
    Relationships.v1.MsgBlockUserTypeUrl,
    Relationships.v1.MsgUnblockUserTypeUrl,

    // Post permissions
    Posts.v3.MsgCreatePostTypeUrl,
    Posts.v3.MsgAddPostAttachmentTypeUrl,
    Posts.v3.MsgRemovePostAttachmentTypeUrl,
    Posts.v3.MsgDeletePostTypeUrl,

    // Reactions
    Reactions.v1.MsgAddReactionTypeUrl,
    Reactions.v1.MsgRemoveReactionTypeUrl,

    // Reports
    Reports.v1.MsgCreateReportTypeUrl,

    // Contract execution permission
    MsgExecuteContractTypeUrl,
];
