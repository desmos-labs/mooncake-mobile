import { Web3AuthLoginProvider } from 'types/web3auth';
import { Account } from './account';

/**
 * Login methods supported by the application.
 */
export enum LoginMethodType {
  PrivateKey = 'PrivateKey',
  Web3Auth = 'Web3Auth',
}

export interface LoginMethodPrivateKey {
  type: LoginMethodType.PrivateKey;
}

interface LoginMethodWeb3Auth {
  type: LoginMethodType.Web3Auth;
  provider: Web3AuthLoginProvider;
}

export type LoginMethod = LoginMethodPrivateKey | LoginMethodWeb3Auth;

export const LoginMethodPrivateKey: LoginMethodPrivateKey = {
  type: LoginMethodType.PrivateKey,
};

export const LoginMethodWeb3AuthApple: LoginMethodWeb3Auth = {
  type: LoginMethodType.Web3Auth,
  provider: Web3AuthLoginProvider.Apple,
};

export const LoginMethodWeb3AuthGoogle: LoginMethodWeb3Auth = {
  type: LoginMethodType.Web3Auth,
  provider: Web3AuthLoginProvider.Google,
};

/**
 * Enum that represents the login flow state.
 */
export enum LoginFlowStep {
  /**
   * The user is not logged in.
   */
  None,
  /**
   * We have the user's account and we need to ask the fee grant.
   */
  RequestFeeGrant,
  /**
   * We have the user's account and we have already requested the feegrant.
   * In this case we should bring back the user in the screen that
   * tells the user to wait for the feegrant.
   */
  WaitingFeeGrant,
  /**
   * We have the user's account and we have the fee grant or the user has
   * enough tokens to pay for the transaction to create the profile.
   * In this case we should bring the user to the create profile screen.
   */
  CreateProfile,
  /**
   * The user has created their profile, and we need to let the user
   * select which creators they want to follow before navigating to the home.
   */
  FollowCreators,
  /**
   * The login flow is completed, we have both the user's account
   * and their profile.
   */
  Completed,
}

interface BaseLoginFlowState<T extends LoginFlowStep> {
  readonly step: T;
}

/**
 * Interface that represents a login flow state where we are
 * not logged in.
 */
interface LoginFlowStateNone extends BaseLoginFlowState<LoginFlowStep.None> {}

/**
 * Interface that represents a login flow state where we are
 * should take the user to the request fee grant screen.
 */
interface LoginFlowStateRequestFeeGrant extends BaseLoginFlowState<LoginFlowStep.RequestFeeGrant> {}
/**
 * Interface that represents a login flow state where we are
 * waiting the fee grant.
 */
interface LoginFlowStateWaitingFeeGrant extends BaseLoginFlowState<LoginFlowStep.WaitingFeeGrant> {}

/**
 * Interface that represents a login flow state where we have
 * the user's account and the user have enough tokens or have requested
 * a fee grant to pay for the transaction to create the profile.
 */
interface LoginFlowStateAccountCreated extends BaseLoginFlowState<LoginFlowStep.CreateProfile> {
  /**
   * Address of the fee granter that we should use to pay for the transaction
   * fees. If undefined means that the user have enough tokens to pay for the
   * transaction.
   */
  readonly feeGranter?: string;
}

/**
 * Interface that represents a login flow state where we have
 * the user's account and the user has created their profile and we have to ask
 * the user to select which creators they want to follow.
 */
interface LoginFlowStateFollowCreators extends BaseLoginFlowState<LoginFlowStep.FollowCreators> {}

/**
 * Interface that represents a login flow state where we have
 * completed the login and we have both the account and the profile.
 */
interface LoginFlowStateCompleted extends BaseLoginFlowState<LoginFlowStep.Completed> {}

export type LoginFlowState =
  | LoginFlowStateNone
  | LoginFlowStateAccountCreated
  | LoginFlowStateRequestFeeGrant
  | LoginFlowStateWaitingFeeGrant
  | LoginFlowStateFollowCreators
  | LoginFlowStateCompleted;

/**
 * Interface that represent an action to navigate to
 * a specific login step.
 */
interface BaseLoginNavigationAction<S extends LoginFlowStep> {
  readonly step: S;
}

/**
 * Interface that represent an action to navigate to
 * the screen that requests the fee grant.
 */
interface LoginNavigationActionRequestFeeGrant
  extends BaseLoginNavigationAction<LoginFlowStep.RequestFeeGrant> {}

/**
 * Interface that represent an action to navigate to
 * the screen that waits for the fee grant.
 */
interface LoginNavigationActionWaitingFeeGrant
  extends BaseLoginNavigationAction<LoginFlowStep.WaitingFeeGrant> {}

/**
 * Interface that represent an action to navigate to
 * the profile creation screen since the user has already created the profile.
 */
interface LoginNavigationActionAccountCreated
  extends BaseLoginNavigationAction<LoginFlowStep.CreateProfile> {
  readonly account: Account;
}

/**
 * Interface that represent an action to navigate to
 * the follow creator screen since the user has already created the profile.
 */
interface LoginNavigationActionFollowCreators
  extends BaseLoginNavigationAction<LoginFlowStep.FollowCreators> {
  readonly account: Account;
}

/**
 * Interface that represent an action to navigate to
 * the login completed screen.
 */
interface LoginNavigationActionCompleted
  extends BaseLoginNavigationAction<LoginFlowStep.Completed> {}

export type LoginNavigationAction =
  | LoginNavigationActionRequestFeeGrant
  | LoginNavigationActionWaitingFeeGrant
  | LoginNavigationActionAccountCreated
  | LoginNavigationActionFollowCreators
  | LoginNavigationActionCompleted;
