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
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: cosmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
    assets: CosmosHubAssets,
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
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: likecoinIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
    assets: LikecoinAssets,
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
