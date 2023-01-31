// TODO: move this inside the types folder
import Long from 'long';

export interface AppConfig {
  readonly subspaceId: Long;
  readonly registeredReactionId: number;
}

const useAppConfig = () => {
  return {
    subspaceId: Long.fromNumber(8),
  } as AppConfig;
};

export default useAppConfig;
