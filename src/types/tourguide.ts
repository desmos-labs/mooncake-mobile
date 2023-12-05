/**
 * Enum that defines at which step the user is
 * in the onboarding that is presented during the login process.
 */
export enum LoginOnboardingStep {
  NotStarted = 0,
  Completed = 1,
}

/**
 * Interface that contains the type defintion of the
 * tour guide state.
 * This is used to keep track of wich tour guide has been presented to the user.
 */
export interface TourGuideState {
  /**
   * Tells at which step the user is in the onboarding that is
   * presented during the login process.
   */
  readonly login: LoginOnboardingStep;
}

/**
 * Default tour guide state.
 */
export const DefaultTourGuideState: TourGuideState = {
  login: LoginOnboardingStep.NotStarted,
};
