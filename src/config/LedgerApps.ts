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
  minVersion: '1.5.3',
};

export const CryptoOrgLedgerApp: LedgerApp = {
  name: 'Crypto.org Chain',
  icon: cryptoComIcon,
  uiName: 'Crypto.org',
  minVersion: '2.16.5',
};

export const TerraLedgerApp: LedgerApp = {
  name: 'Terra',
  icon: terraIcon,
  uiName: 'Terra',
  minVersion: '1.0.0',
};

export const LedgerApps: LedgerApp[] = [
  // {
  //     name: "band",
  //     icon: require("../assets/chains/band.png"),
  //     uiName: "Band",
  //     minVersion: "1.5.3",
  // },
  CosmosLedgerApp,
  CryptoOrgLedgerApp,
  TerraLedgerApp,
];
