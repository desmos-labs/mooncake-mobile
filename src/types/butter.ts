export interface ButterConfig {
  /**
   * Desmos address of the account used by the APIs
   */
  readonly desmos_address: string;

  /**
   * IBC data that should be used when connecting a Desmos Profile to an external centralized application.
   */
  ibc: any;

  /**
   * Invites configuration.
   */
  invites: {
    required_impact_points: any[];
  };
}
