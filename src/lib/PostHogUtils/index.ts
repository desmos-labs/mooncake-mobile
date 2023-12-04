import { EncodeObject, StdFee } from '@desmoslabs/desmjs';
import { PostHog } from 'posthog-react-native';

/**
 * Enum that contains all the user behaviours that the application
 * tracks.
 */
export enum UserBehaviour {
  FeeEstimationFailed = 'Failed Fee Estimation',
  TXBroadcastFailed = 'Failed TX',
  ViewEvent = 'View Event',
  ViewEventMemories = 'View Event Memories',
  AddEventToCalendar = 'Add Event To Calendar',
  SearchEventLocation = 'Search Event Location on Google Maps',
  OpenEventOrganizersList = 'Open Event Organizers List',
  OpenEventParticipantsList = 'Open Event Participants List',
  OpenEventInterestedPeopleList = 'Open Event Interested People List',
  ShareEvent = 'Share Event',
  SearchEventWithTags = 'Search Event With Tags',
  SearchEventWithText = 'Search Event With Text',
  ViewBondQr = 'View Bond QR Code',
  ViewManageContacts = 'View Manage Contacts',
  AcceptBondPicture = 'Accept Bond Picture',
  RefuseBondPicture = 'Refuse Bond Picture',
  SkipBondContactShare = 'Skip Share Contacts',
}

/**
 * Enum that contains the keys that will be used when adding extra informations
 * to the user behaviour that the application tracks.
 */
export enum UserBehaviourArgsKey {
  Error = 'Error',
  UserAddress = 'User Address',
  Messages = 'Messages',
  Fees = 'Fees',
  EventId = 'Event ID',
  Tags = 'Tags',
}

/**
 * Identifies the user on PostHog.
 * @param posthog The PostHog instance to use
 * @param address The address of the user to identify
 */
export const identifyPostHogUser = async (posthog: PostHog, address: string) => {
  if (address) {
    // We identify the user on PostHog
    posthog.identify(address);
  }
};

/**
 * Captures the event of a failed fee estimation.
 * @param postHog The PostHog instance to use.
 * @param params The parameters of the failed fee estimation.
 */
export const captureFailedFeeEstimationError = (
  postHog: PostHog,
  params: {
    error: any;
    userAddress: string;
    messages: EncodeObject[];
  },
) => {
  postHog.capture(UserBehaviour.FeeEstimationFailed, {
    [UserBehaviourArgsKey.Error]: params.error,
    [UserBehaviourArgsKey.UserAddress]: params.userAddress,
    [UserBehaviourArgsKey.Messages]: params.messages.map(msg => msg.typeUrl),
  });
};

/**
 * Captures the event of a failed transaction.
 * @param posthog The PostHog instance to use.
 * @param params The parameters of the failed transaction.
 */
export const captureFailedTxError = (
  posthog: PostHog,
  params: {
    error: Error;
    userAddress: string;
    messages: EncodeObject[];
    fees: StdFee;
  },
) => {
  posthog.capture(UserBehaviour.TXBroadcastFailed, {
    [UserBehaviourArgsKey.Error]: params.error.message,
    [UserBehaviourArgsKey.UserAddress]: params.userAddress,
    [UserBehaviourArgsKey.Messages]: params.messages.map(msg => msg.typeUrl),
    [UserBehaviourArgsKey.Fees]: params.fees,
  });
};
