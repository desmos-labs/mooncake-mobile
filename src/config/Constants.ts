/**
 * Interface that defines all the constants of the application.
 */
interface ButterConstants {
  readonly apiEndpoint: string;
  readonly subspaceId: number;
}

/**
 * Default values for the application's constants.
 */
const Constants: ButterConstants = {
  apiEndpoint: 'https://api.mooncake.space',
  subspaceId: 6,
};

export default Constants;
