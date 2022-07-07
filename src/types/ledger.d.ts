import {ImageSourcePropType} from 'react-native';

export {};

declare global {
  type Subscription = {
    unsubscribe: () => void;
  };

  type BleLedger = {
    id: string;
    name: string;
  };

  type LedgerApp = {
    /**
     * Ledger application name.
     */
    name: string;
    /**
     * Application icon to be displayed to the user.
     */
    icon: ImageSourcePropType;
    /**
     * Name to be displayed to the user.
     */
    uiName: string;
    /**
     * Min ledger application version.
     */
    minVersion: string;
  };
}
