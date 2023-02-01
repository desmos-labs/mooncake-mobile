export interface ButterConfig {
  /**
   * Desmos address of the account used by the APIs
   */
  readonly desmosAddress: string;

  /**
   * IBC data that should be used when connecting a Desmos Profile to an external centralized application.
   */
  readonly ibc: {
    readonly port: string;
    readonly channel: string;
  };

  /**
   * Invites configuration.
   */
  readonly invites: {
    readonly requiredImpactPoints: number[];
  };
}
