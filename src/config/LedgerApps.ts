import {cosmosIcon, cryptoComIcon, desmosIcon, terraIcon} from 'assets/images';

export const DesmosLedgerApp: LedgerApp = {
  name: 'Desmos',
  icon: desmosIcon,
  uiName: 'Desmos',
  minVersion: '2.18.2',
};

export const CosmosLedgerApp: LedgerApp = {
  name: 'Cosmos',
  icon: cosmosIcon,
  uiName: 'Cosmos',
  minVersion: '2.34.6',
};

export const CryptoOrgLedgerApp: LedgerApp = {
  name: 'Crypto.org Chain',
  icon: cryptoComIcon,
  uiName: 'Crypto.org',
  minVersion: '2.16.7',
};

export const TerraLedgerApp: LedgerApp = {
  name: 'Terra',
  icon: terraIcon,
  uiName: 'Terra',
  minVersion: '1.2.0',
};

export const ledgerApps: LedgerApp[] = [
  DesmosLedgerApp,
  CosmosLedgerApp,
  CryptoOrgLedgerApp,
  TerraLedgerApp,
];
