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

export type ComparableTip = Pick<Tip, 'target' | 'sender' | 'amount'>;

export const areTipsEqual = (first: ComparableTip, second: ComparableTip): boolean => {
  return (
    first.target === second.target &&
    first.sender.address === second.sender.address &&
    first.amount === second.amount
  );
};
