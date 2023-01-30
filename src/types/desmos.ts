import {ApplicationLinkState} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';

export interface DesmosProfile {
  /**
   * The user's address
   */
  readonly address: string;
  /**
   * User DTag
   */
  readonly dtag?: string;
  /**
   * The user nickname
   */
  readonly nickname?: string;
  /**
   * The user bio
   */
  readonly bio?: string;
  /**
   * Url to the user profile picture
   */
  readonly profilePicture?: string;
  /**
   * Url to the user cover picture
   */
  readonly coverPicture?: string;
}

export interface ChainLink {
  /**
   * Name of the linked chain like osmosis, cosmos.
   */
  readonly chainName: string;
  /**
   * Desmos address of the user.
   */
  readonly userAddress: string;
  /**
   * User address on the linked chain.
   */
  readonly externalAddress: string;
  /**
   * Proof that was used to prove the ownership of the external account.
   */
  readonly proof: ChainLinkProof;
  /**
   * Time when the chain link has been created.
   */
  readonly creationTime: Date;
}

/**
 * Type that represents the information need to
 * prove the ownership of a different chain account.
 */
export interface ChainLinkProof {
  /**
   * Plain text that was signed to prove the ownership of the external account.
   */
  readonly plainText: string;
  /**
   * Signature that was produced to prove the ownerhip of the external account.
   */
  readonly signature: string;
}

export interface ApplicationLink {
  /**
   * Name of the application that has been connected.
   */
  readonly application: string;
  /**
   * Username of the connected account.
   */
  readonly username: string;
  /**
   * State of the application link.
   */
  readonly state: ApplicationLinkState;
  /**
   * Creation date of the application link.
   */
  readonly creationTime: Date;
}

export interface FollowedUser {
  /**
   * Address of the followed user.
   */
  readonly address: string;
}

export type PostID = number;

export interface PostReaction {
  /**
   * Id of the post related to this reaction.
   */
  readonly postId: PostID;
}
