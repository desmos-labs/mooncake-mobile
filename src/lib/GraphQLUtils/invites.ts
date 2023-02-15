import { GqlInvite } from 'services/graphql/queries/GetInvites';
import { Invite } from 'types/invites';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';

export function convertGQLInvite(invite: GqlInvite): Invite {
  return {
    claimer: invite.claimer ? convertGraphQLProfile(invite.claimer) : undefined,
    code: invite.code,
    link: invite.link,
    inviterAddress: invite.inviter_address,
    claimerAddress: invite.claimer_address.length > 0 ? invite.claimer_address : undefined,
    creationTime: new Date(invite.creation_time),
    expirationTime: invite.expiration_time ? new Date(invite.expiration_time) : undefined,
  };
}
