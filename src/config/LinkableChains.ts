import {
  BandHdPath,
  BitcannaHdPath,
  BitsongHdPath,
  CosmosHdPath,
  CroHdPath,
  DesmosHdPath,
  IrisNetHdPath,
  IXOHdPath,
  KavaHdPath,
  LunaHdPath,
  ROWANHdPath,
  SCRTHdPath,
  SENTHdPath,
  STARSHdPath,
  TGDHdPath,
  XPRTHdPath,
} from 'types/hdpath';
import {
  akashIcon,
  bandIcon,
  bitcannaIcon,
  bitsongIcon,
  cosmosIcon,
  cryptoComIcon,
  desmosIcon,
  eMoneyIcon,
  irisnetIcon,
  ixoIcon,
  junoIcon,
  kavaIcon,
  likecoinIcon,
  osmosisIcon,
  regenIcon,
  rowanIcon,
  secretIcon,
  sentinelIcon,
  stargazeIcon,
  terraIcon,
  tgradeIcon,
  xprtIcon,
} from 'assets/images';
import {ChainConfig} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {ChainAsset, LinkableChain} from 'types/chains';
import {
  AkashAssets,
  BandAssets,
  BitcannaAssets,
  BitsongAssets,
  CosmosHubAssets,
  CryptoOrgAssets,
  DesmosAssets,
  EMoneyAssets,
  IrisnetAssets,
  IXOAssets,
  JunoAssets,
  KavaAssets,
  LikecoinAssets,
  OsmosisAssets,
  RegenAssets,
  SecretnetworkAssets,
  SentinelAssets,
  SifchainAssets,
  StargazeAssets,
  TerraAssets,
  TgradeAssets,
  XPRTAssets,
} from 'config/ChainAssets';
import {
  CosmosLedgerApp,
  CryptoOrgLedgerApp,
  DesmosLedgerApp,
  TerraLedgerApp,
} from 'config/LedgerApps';

// see https://github.com/cosmos/chain-registry
const LinkableChains: LinkableChain[] = [
  {
    name: 'Desmos',
    prefix: 'desmos',
    hdPath: DesmosHdPath,
    icon: desmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'desmos',
    }),
    assets: DesmosAssets,
    ledgerApps: [DesmosLedgerApp],
  },
  {
    name: 'Akash',
    prefix: 'akash',
    hdPath: CosmosHdPath,
    icon: akashIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
    assets: AkashAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Band',
    prefix: 'band',
    hdPath: BandHdPath,
    icon: bandIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
    assets: BandAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Bitcanna',
    prefix: 'bcna',
    hdPath: BitcannaHdPath,
    icon: bitcannaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'bitcanna',
    }),
    assets: BitcannaAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Bitsong',
    prefix: 'bitsong',
    hdPath: BitsongHdPath,
    icon: bitsongIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'bitsong',
    }),
    assets: BitsongAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: cosmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos hub',
    }),
    assets: CosmosHubAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Crypto.org',
    prefix: 'cro',
    hdPath: CroHdPath,
    icon: cryptoComIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'crypto.org',
    }),
    assets: CryptoOrgAssets,
    ledgerApps: [CosmosLedgerApp, CryptoOrgLedgerApp],
  },
  {
    name: 'e-Money',
    prefix: 'emoney',
    hdPath: CosmosHdPath,
    icon: eMoneyIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
    assets: EMoneyAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Impact Hub',
    prefix: 'ixo',
    hdPath: IXOHdPath,
    icon: ixoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'impacthub',
    }),
    assets: IXOAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'IRISnet',
    prefix: 'iaa',
    hdPath: IrisNetHdPath,
    icon: irisnetIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'irisnet',
    }),
    assets: IrisnetAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Juno',
    prefix: 'juno',
    hdPath: CosmosHdPath,
    icon: junoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
    assets: JunoAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Kava',
    prefix: 'kava',
    hdPath: KavaHdPath,
    icon: kavaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
    assets: KavaAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Likecoin',
    prefix: 'like',
    hdPath: CosmosHdPath,
    icon: likecoinIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
    assets: LikecoinAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    hdPath: CosmosHdPath,
    icon: osmosisIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
    assets: OsmosisAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Regen',
    prefix: 'regen',
    hdPath: CosmosHdPath,
    icon: regenIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
    assets: RegenAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Terra',
    prefix: 'terra',
    hdPath: LunaHdPath,
    icon: terraIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
    assets: TerraAssets,
    ledgerApps: [TerraLedgerApp, CosmosLedgerApp],
  },
  {
    name: 'Persistence',
    prefix: 'persistence',
    hdPath: XPRTHdPath,
    icon: xprtIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'persistence',
    }),
    assets: XPRTAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Secret Network',
    prefix: 'secret',
    hdPath: SCRTHdPath,
    icon: secretIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'secretnetwork',
    }),
    assets: SecretnetworkAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Sentinel',
    prefix: 'sent',
    hdPath: SENTHdPath,
    icon: sentinelIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'sentinel',
    }),
    assets: SentinelAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Tgrade',
    prefix: 'tgrade',
    hdPath: TGDHdPath,
    icon: tgradeIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'tgrade',
    }),
    assets: TgradeAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Stargaze',
    prefix: 'stars',
    hdPath: STARSHdPath,
    icon: stargazeIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'stargaze',
    }),
    assets: StargazeAssets,
    ledgerApps: [CosmosLedgerApp],
  },
  {
    name: 'Sifchain',
    prefix: 'sif',
    hdPath: ROWANHdPath,
    icon: rowanIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'sifchain',
    }),
    assets: SifchainAssets,
    ledgerApps: [CosmosLedgerApp],
  },
];

/**
 * Returns a chain's default asset. Currently, it just returns the first ChainAsset.
 */
export const getDefaultChainAsset = (chainName: string): ChainAsset => {
  const chain = LinkableChains.find(_chain => {
    return _chain.name.toLowerCase() === chainName.toLowerCase();
  });
  if (chain && chain.assets) {
    return chain.assets[0];
  }
  if (!chain) {
    console.log('could not find', chainName);
    throw new Error(`Chain with name ${chainName} not found in LinkableChains`);
  } else throw new Error('Chain has no assets');
};

export default LinkableChains;
