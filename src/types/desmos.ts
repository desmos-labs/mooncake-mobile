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
  readonly profilePicture?: string;
  /**
   * Url to the user cover picture
   */
  readonly coverPicture?: string;
  /**
   * Date in which the profile was created.
   */
  readonly creationTime: string;
}

/**
 * Interface representing a reaction to a post.
 */
export interface PostReaction {
  readonly author: DesmosProfile;
}

/**
 * Interface representing a Desmos profile typed as queried from the server.
 */
export interface GqlDesmosProfile {
  address: string;
  bio: string;
  dtag: string;
  creation_time: string;
  cover_picture: string;
  nickname: string;
  profile_picture: string;
}

/**
 * Interface representing a reaction to a post typed as queried from the server.
 */
export interface GqlPostReaction {
  readonly author: GqlDesmosProfile;
}

/**
 * Interface representing reactions to a post typed as queried from the server.
 */
export interface GqlPostReactions {
  readonly reactions: GqlPostReaction[];
}
