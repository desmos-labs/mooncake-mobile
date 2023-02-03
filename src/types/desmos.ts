import { ApplicationLinkState } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';

/**
 * Represents a reaction that is registered on the subspace and can be used.
 */
export interface RegisteredReaction {
  readonly id: number;
  readonly shortHandCode: string;
  readonly displayValue: string;
}

/**
 * Reporting reason that is registered within a subspace and can be used when reporting a post or user.
 */
export interface ReportReason {
  readonly id: number;
  readonly title: string;
  readonly description: string;
}

/**
 * Parameters related to the subspace currently used by the application.
 */
export interface SubspaceParams {
  readonly registeredReactions: RegisteredReaction[];
  readonly reportReasons: ReportReason[];
  /**
   * Configuration of the smart contract allowing to tip another user.
   */
  readonly tipsContractConfig: {
    readonly serviceFeePercentage: number;
  };
}

/**
 * Search inside the given params to find the id of a registered reaction that represents a like.
 * @param params {SubspaceParams} - Params inside which to search.
 * @throws {Error} if no registered reaction represents a like.
 */
export const getLikeReactionId = (params: SubspaceParams): number => {
  const reaction = params.registeredReactions.find(r => r.shortHandCode.includes('like'));
  if (!reaction) {
    throw new Error(
      'Subspace does not contain any registered reaction with shorthand code that represents a like',
    );
  }
  return reaction.id;
};

/**
 * On-chain parameters related to the posts' module.
 * These data should be considered when creating or editing a post.
 */
export interface PostsParams {
  readonly maxTextLength: number;
}

/**
 * On-chain parameters related to the profiles' module.
 * These data should be considered when creating or updating a profile.
 */
export interface ProfileParams {
  readonly bio: {
    readonly maxLength: number;
  };
  readonly dTag: {
    readonly regEx: string;
    readonly maxLength: number;
    readonly minLength: number;
  };
  readonly nickname: {
    readonly maxLength: number;
    readonly minLength: number;
  };
}

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

/**
 * Represents the different status that the data can have within the application.
 */
export enum DataStatus {
  /**
   * The data is synced with the chain.
   */
  SYNCED = 'SYNCED',
  /**
   * The data has been created only locally, but has yet to be synced with the chain.
   */
  CREATED_LOCALLY = 'CREATED_LOCALLY',
  /**
   * The data has been deleted only locally, but has yet to be synced with the chain.
   */
  DELETED_LOCALLY = 'DELETED_LOCALLY',
}

export interface FollowedUser {
  /**
   * Address of the followed user.
   */
  readonly address: string;
  /**
   * Identifies the status of this relationship user.
   */
  readonly status: DataStatus;
  /**
   * Date in which the relationship was lastly edited.
   * This is used in order to merge relationships from the server and stored locally,
   * to avoid having the local storage going too much off-sync with the server.
   */
  readonly editedDate: Date;
}

export type PostID = number;

export interface PostReaction {
  /**
   * ID of the subspace of the post related to this reaction.
   */
  readonly subspaceId: number;
  /**
   * ID of the post related to this reaction.
   */
  readonly postId: PostID;
  /**
   * Identifies the status of this reaction.
   */
  readonly status: DataStatus;
  /**
   * Date in which the reaction was lastly edited.
   * This is used in order to merge reactions from the server and stored locally,
   * to avoid having the local storage going too much off-sync with the server.
   */
  readonly editedDate: Date;
}

export interface PostTip {
  /**
   * ID of the subspace of the post related to this tip.
   */
  readonly subspaceId: number;
  /**
   * ID of the post related to this tip.
   */
  readonly postId: PostID;
  /**
   * Identifies the status of this tip.
   */
  readonly status: DataStatus;
  /**
   * Date in which the tip was lastly edited.
   * This is used in order to merge tips from the server and stored locally,
   * to avoid having the local storage going too much off-sync with the server.
   */
  readonly editedDate: Date;
}
