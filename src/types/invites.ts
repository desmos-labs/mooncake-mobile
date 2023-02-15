import { DesmosProfile } from 'types/desmos';

/**
 * Interface representing an invitation.
 */
export interface Invite {
  claimer?: DesmosProfile;
  code: string;
  link: string;
  creationTime: Date;
  expirationTime?: Date;
  inviterAddress: string;
  claimerAddress?: string;
}
