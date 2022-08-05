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
  secretIcon,
  sentinelIcon,
  stargazeIcon,
  terraIcon,
  tgradeIcon,
  xprtIcon,
} from 'assets/images';
import {ChainConfig} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {LinkableChain} from 'types/chains';

const LinkableChains: LinkableChain[] = [
  {
    name: 'Akash',
    prefix: 'akash',
    hdPath: CosmosHdPath,
    icon: akashIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
  },
  {
    name: 'Band',
    prefix: 'band',
    hdPath: BandHdPath,
    icon: bandIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
  },
  {
    name: 'Bitcanna',
    prefix: 'bcna',
    hdPath: BitcannaHdPath,
    icon: bitcannaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'bitcanna',
    }),
  },
  {
    name: 'Bitsong',
    prefix: 'bitsong',
    hdPath: BitsongHdPath,
    icon: bitsongIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'bitsong',
    }),
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: cosmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
  },
  {
    name: 'Crypto.org',
    prefix: 'cro',
    hdPath: CroHdPath,
    icon: cryptoComIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'crypto.org',
    }),
  },
  {
    name: 'Desmos',
    prefix: 'desmos',
    hdPath: DesmosHdPath,
    icon: desmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'desmos',
    }),
  },
  {
    name: 'e-Money',
    prefix: 'emoney',
    hdPath: CosmosHdPath,
    icon: eMoneyIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
  },
  {
    name: 'Impact Hub',
    prefix: 'ixo',
    hdPath: IXOHdPath,
    icon: ixoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'impacthub',
    }),
  },
  {
    name: 'IRISnet',
    prefix: 'iaa',
    hdPath: IrisNetHdPath,
    icon: irisnetIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'irisnet',
    }),
  },
  {
    name: 'Juno',
    prefix: 'juno',
    hdPath: CosmosHdPath,
    icon: junoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
  },
  {
    name: 'Kava',
    prefix: 'kava',
    hdPath: KavaHdPath,
    icon: kavaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: likecoinIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    hdPath: CosmosHdPath,
    icon: osmosisIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
  },
  {
    name: 'Regen',
    prefix: 'regen',
    hdPath: CosmosHdPath,
    icon: regenIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
  },
  {
    name: 'Terra',
    prefix: 'terra',
    hdPath: LunaHdPath,
    icon: terraIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
  },
  {
    name: 'Persistence',
    prefix: 'persistence',
    hdPath: XPRTHdPath,
    icon: xprtIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'persistence',
    }),
  },
  {
    name: 'Secret Network',
    prefix: 'secret',
    hdPath: SCRTHdPath,
    icon: secretIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'secretnetwork',
    }),
  },
  {
    name: 'Sentinel',
    prefix: 'sent',
    hdPath: SENTHdPath,
    icon: sentinelIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'sentinel',
    }),
  },
  {
    name: 'Tgrade',
    prefix: 'tgrade',
    hdPath: TGDHdPath,
    icon: tgradeIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'tgrade',
    }),
  },
  {
    name: 'Stargaze',
    prefix: 'stars',
    hdPath: STARSHdPath,
    icon: stargazeIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'stargaze',
    }),
  },
];

export default LinkableChains;
