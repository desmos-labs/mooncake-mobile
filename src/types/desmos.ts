import { ApplicationLinkState } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';
import { Asset } from 'react-native-image-picker';
import { CacheableObject } from 'types/cache';
import { Post } from 'types/posts';

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

export interface TipsContractConfig {
  readonly address: string;
  readonly serviceFeePercentage: number;
}

/**
 * Parameters related to the subspace currently used by the application.
 */
export interface SubspaceParams {
  /**
   * Reactions that can be used within this subspace.
   */
  readonly registeredReactions: RegisteredReaction[];
  /**
   * Reasons that can be used to report a post.
   */
  readonly reportReasons: ReportReason[];
  /**
   * Configuration of the smart contract allowing to tip another user.
   */
  readonly tipsContractConfig: TipsContractConfig | undefined;
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
  readonly dTag?: string;
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
  readonly profilePicture?: Asset | string;
  /**
   * Url to the user cover picture
   */
  readonly coverPicture?: Asset | string;
  /**
   * Date in which the profile was created.
   */
  readonly creationTime: string;
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

export interface PostReaction extends CacheableObject {
  /**
   * Post associated with the reaction.
   */
  readonly post: Post;
  /**
   * ID of the reaction.
   */
  readonly id: number | undefined;
  /**
   * Author of the reaction.
   */
  readonly author: DesmosProfile;
}

/**
 * Represents a comparable {@link PostReaction}.
 */
export interface ComparableReaction {
  readonly subspaceId: number;
  readonly postId: number;
}

/**
 * Allows to determine whether the two given reactions are equals or not.
 */
export const areReactionsEqual = (first: PostReaction, second: ComparableReaction) => {
  return first.post.subspaceId === second.subspaceId && first.post.id === second.postId;
};
