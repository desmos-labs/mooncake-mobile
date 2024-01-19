import { EventArg } from '@react-navigation/native';

export type BeforeRemoveEventArgs = EventArg<
  'beforeRemove',
  true,
  { action: { type: string; source?: string }; target?: string }
>;
