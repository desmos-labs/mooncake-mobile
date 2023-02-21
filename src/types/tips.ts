import { Coin } from '@cosmjs/stargate';
import { Post } from 'types/posts';
import { DesmosProfile } from 'types/desmos';
import { CacheableObject } from 'types/cache';

export enum TipTargetType {
  POST,
  USER,
}

export interface PostTipTarget {
  readonly type: TipTargetType.POST;
  readonly post: Post;
}

export interface UserTipTarget {
  readonly type: TipTargetType.USER;
  readonly user: DesmosProfile;
}

export type TipTarget = PostTipTarget | UserTipTarget;

export interface Tip extends CacheableObject {
  /**
   * Target of the tip.
   */
  readonly target: TipTarget;
  /**
   * Amount that was tipped.
   */
  readonly amount: Coin[];
  /**
   * Profile of the user that has sent the tip.
   */
  readonly sender: DesmosProfile;
  /**
   * Date at which the tip was made.
   */
  readonly creationDate: string;
}

export interface ComparablePostTipTarget {
  readonly type: TipTargetType.POST;
  readonly subspaceId: number;
  readonly postId: number;
}

export interface ComparableUserTipTarget {
  readonly type: TipTargetType.USER;
  readonly address: string;
}

export type ComparableTipTarget = ComparablePostTipTarget | ComparableUserTipTarget;

const areTargetsEqual = (first: TipTarget, second: ComparableTipTarget): boolean => {
  if (first.type !== second.type) {
    return false;
  }

  switch (first.type) {
    case TipTargetType.POST:
      return (
        second.type === TipTargetType.POST &&
        first.post.subspaceId === second.subspaceId &&
        first.post.id === second.postId
      );
    case TipTargetType.USER:
      return second.type === TipTargetType.USER && first.user.address === second.address;
  }
};

export interface ComparableTip {
  readonly target: ComparableTipTarget;
}

export const comparablePostTip = (subspaceId: number, postId: number): ComparableTip => ({
  target: {
    type: TipTargetType.POST,
    subspaceId,
    postId,
  },
});

export const comparableUserTip = (address: string): ComparableTip => ({
  target: {
    type: TipTargetType.USER,
    address,
  },
});

export const comparableTip = (tip: Tip): ComparableTip => {
  switch (tip.target.type) {
    case TipTargetType.POST:
      return comparablePostTip(tip.target.post.subspaceId, tip.target.post.id);
    case TipTargetType.USER:
      return comparableUserTip(tip.target.user.address);
  }
};

export const areTipsEqual = (first: Tip, second: ComparableTip): boolean => {
  return areTargetsEqual(first.target, second.target);
};
