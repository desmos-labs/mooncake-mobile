import {DenomUnit} from '@desmoslabs/desmjs';
import LinkableChains from 'config/LinkableChains';

declare global {
  type ChainAsset = {
    description: string;
    denom_units: DenomUnit[];
    base: string;
    name: string;
    display: string;
    symbol: string;
    coingecko_id: string;
    type_asset?: string;
  };
}

/**
 * Returns a chain's default asset. Currently, it just returns the first ChainAsset.
 */
export const getDefaultChainAsset = (chainName: string): ChainAsset => {
  const chain = LinkableChains.find(_chain => _chain.name === chainName);
  if (chain && chain.assets) {
    return chain.assets[0];
  }
  if (!chain) {
    throw new Error(`Chain with name ${chainName} not found in LinkableChains`);
  } else throw new Error('Chain has no assets');
};

/**
 * Get an asset's denom symbol, as well as exponent data.
 */
export const getDenomSymbol = (
  chainName: string,
): {
  symbol: string;
  denom: {
    denom: string;
    exponent: number;
  };
} => {
  const chainAsset = getDefaultChainAsset(chainName);

  return {
    symbol: chainAsset.symbol,
    denom: chainAsset.denom_units.find(
      x => x.denom === chainAsset.symbol.toLowerCase(),
    ) as {denom: string; exponent: number},
  };
};

export const DesmosAssets: ChainAsset[] = [
  {
    description: 'The native token of Desmos',
    denom_units: [
      {
        denom: 'udsm',
        exponent: 0,
      },
      {
        denom: 'dsm',
        exponent: 6,
      },
    ],
    base: 'udsm',
    name: 'Desmos',
    display: 'dsm',
    symbol: 'DSM',
    coingecko_id: 'desmos',
  },
];

export const AkashAssets: ChainAsset[] = [
  {
    description:
      "Akash Token (AKT) is the Akash Network's native utility token, used as the primary means to govern, secure the blockchain, incentivize participants, and provide a default mechanism to store and exchange value.",
    denom_units: [
      {
        denom: 'uakt',
        exponent: 0,
      },
      {
        denom: 'akt',
        exponent: 6,
      },
    ],
    base: 'uakt',
    name: 'Akash Network',
    display: 'akt',
    symbol: 'AKT',
    coingecko_id: 'akash-network',
  },
];

export const BandAssets: ChainAsset[] = [
  {
    description: 'The native token of BandChain',
    denom_units: [
      {
        denom: 'uband',
        exponent: 0,
      },
      {
        denom: 'band',
        exponent: 6,
      },
    ],
    base: 'uband',
    display: 'band',
    name: 'Band Protocol',
    symbol: 'BAND',
    coingecko_id: 'band-protocol',
  },
];

export const BitcannaAssets: ChainAsset[] = [
  {
    description:
      'The BCNA coin is the transactional token within the BitCanna network, serving the legal cannabis industry through its payment network, supply chain and trust network.',
    denom_units: [
      {
        denom: 'ubcna',
        exponent: 0,
      },
      {
        denom: 'bcna',
        exponent: 6,
      },
    ],
    base: 'ubcna',
    display: 'bcna',
    name: 'BitCanna',
    symbol: 'BCNA',
    coingecko_id: 'bitcanna',
  },
];

export const BitsongAssets: ChainAsset[] = [
  {
    description: 'BitSong Native Token',
    denom_units: [
      {
        denom: 'ubtsg',
        exponent: 0,
      },
      {
        denom: 'btsg',
        exponent: 6,
      },
    ],
    base: 'ubtsg',
    name: 'BitSong',
    display: 'btsg',
    symbol: 'BTSG',
    type_asset: 'sdk.coin',
    coingecko_id: 'bitsong',
  },
];

export const CosmosHubAssets: ChainAsset[] = [
  {
    description: 'The native staking and governance token of the Cosmos Hub.',
    denom_units: [
      {
        denom: 'uatom',
        exponent: 0,
      },
      {
        denom: 'atom',
        exponent: 6,
      },
    ],
    base: 'uatom',
    name: 'Cosmos',
    display: 'atom',
    symbol: 'ATOM',
    coingecko_id: 'cosmos',
  },
];

export const CryptoOrgAssets: ChainAsset[] = [
  {
    description: 'CRO coin is the token for the Crypto.com platform.',
    denom_units: [
      {
        denom: 'basecro',
        exponent: 0,
      },
      {
        denom: 'cro',
        exponent: 8,
      },
    ],
    base: 'basecro',
    name: 'Cronos',
    display: 'cro',
    symbol: 'CRO',
    coingecko_id: 'crypto-com-chain',
  },
];

export const EMoneyAssets: ChainAsset[] = [
  {
    description:
      'e-Money NGM staking token. In addition to earning staking rewards the token is bought back and burned based on e-Money stablecoin inflation.',
    denom_units: [
      {
        denom: 'ungm',
        exponent: 0,
      },
      {
        denom: 'ngm',
        exponent: 6,
      },
    ],
    base: 'ungm',
    name: 'e-Money',
    display: 'ngm',
    symbol: 'NGM',
    coingecko_id: 'e-money',
  },
  {
    description:
      'e-Money EUR stablecoin. Audited and backed by fiat EUR deposits and government bonds.',
    denom_units: [
      {
        denom: 'eeur',
        exponent: 0,
      },
      {
        denom: 'EUR',
        exponent: 6,
      },
    ],
    base: 'eeur',
    name: 'e-Money EUR',
    display: 'eur',
    symbol: 'EEUR',
    coingecko_id: 'e-money-eur',
  },
];

export const IXOAssets: ChainAsset[] = [
  {
    description: 'The native token of IXO Chain',
    denom_units: [
      {
        denom: 'uixo',
        exponent: 0,
      },
      {
        denom: 'ixo',
        exponent: 6,
      },
    ],
    base: 'uixo',
    name: 'IXO',
    display: 'ixo',
    symbol: 'IXO',
    coingecko_id: 'ixo',
  },
];

export const IrisnetAssets: ChainAsset[] = [
  {
    description:
      'The IRIS token is the native governance token for the IrisNet chain.',
    denom_units: [
      {
        denom: 'uiris',
        exponent: 0,
      },
      {
        denom: 'iris',
        exponent: 6,
      },
    ],
    base: 'uiris',
    name: 'IRISnet',
    display: 'iris',
    symbol: 'IRIS',
    coingecko_id: 'iris-network',
  },
];

export const JunoAssets: ChainAsset[] = [
  {
    description: 'The native token of JUNO Chain',
    denom_units: [
      {
        denom: 'ujuno',
        exponent: 0,
      },
      {
        denom: 'juno',
        exponent: 6,
      },
    ],
    base: 'ujuno',
    name: 'Juno',
    display: 'juno',
    symbol: 'JUNO',
    coingecko_id: 'juno-network',
  },
];

export const KavaAssets: ChainAsset[] = [
  {
    description: 'The native staking and governance token of Kava',
    denom_units: [
      {
        denom: 'ukava',
        exponent: 0,
      },
      {
        denom: 'kava',
        exponent: 6,
      },
    ],
    base: 'ukava',
    name: 'Kava',
    display: 'kava',
    symbol: 'KAVA',
    coingecko_id: 'kava',
  },
];

export const LikecoinAssets: ChainAsset[] = [
  {
    description:
      'LIKE is the native staking and governance token of LikeCoin chain, a Decentralized Publishing Infrastructure to empower content ownership, authenticity, and provenance.',
    denom_units: [
      {
        denom: 'nanolike',
        exponent: 0,
      },
      {
        denom: 'like',
        exponent: 9,
      },
    ],
    base: 'nanolike',
    name: 'LikeCoin',
    display: 'like',
    symbol: 'LIKE',
    coingecko_id: 'likecoin',
  },
];

export const OsmosisAssets: ChainAsset[] = [
  {
    description: 'The native token of Osmosis',
    denom_units: [
      {
        denom: 'uosmo',
        exponent: 0,
      },
      {
        denom: 'osmo',
        exponent: 6,
      },
    ],
    base: 'uosmo',
    name: 'Osmosis',
    display: 'osmo',
    symbol: 'OSMO',
    coingecko_id: 'osmosis',
  },
];

export const RegenAssets: ChainAsset[] = [
  {
    description: 'REGEN coin is the token for the Regen Network Platform',
    denom_units: [
      {
        denom: 'uregen',
        exponent: 0,
      },
      {
        denom: 'regen',
        exponent: 6,
      },
    ],
    base: 'uregen',
    name: 'Regen Network',
    display: 'regen',
    symbol: 'REGEN',
    coingecko_id: 'regen',
  },
];

export const TerraAssets: ChainAsset[] = [
  {
    description: 'The native staking token of Terra Classic.',
    denom_units: [
      {
        denom: 'uluna',
        exponent: 0,
        // aliases: ['microluna'],
      },
      {
        denom: 'mluna',
        exponent: 3,
        // aliases: ['milliluna'],
      },
      {
        denom: 'luna',
        exponent: 6,
        // aliases: ['lunc'],
      },
    ],
    base: 'uluna',
    name: 'Luna Classic',
    display: 'luna',
    symbol: 'LUNC',
    coingecko_id: 'terra-luna',
  },
];

export const TgradeAssets: ChainAsset[] = [
  {
    description: 'The native token of Tgrade',
    denom_units: [
      {
        denom: 'utgd',
        exponent: 0,
      },
      {
        denom: 'tgd',
        exponent: 6,
      },
    ],
    base: 'utgd',
    name: 'Tgrade',
    display: 'tgd',
    symbol: 'TGD',
    coingecko_id: 'tgrade',
  },
];

export const XPRTAssets: ChainAsset[] = [
  {
    description:
      'The XPRT token is primarily a governance token for the Persistence chain.',
    denom_units: [
      {
        denom: 'uxprt',
        exponent: 0,
      },
      {
        denom: 'xprt',
        exponent: 6,
      },
    ],
    base: 'uxprt',
    name: 'Persistence',
    display: 'xprt',
    symbol: 'XPRT',
    coingecko_id: 'persistence',
  },
];

export const SecretnetworkAssets: ChainAsset[] = [
  {
    description: 'The native token of Secret Network',
    denom_units: [
      {
        denom: 'uscrt',
        exponent: 0,
      },
      {
        denom: 'scrt',
        exponent: 6,
      },
    ],
    base: 'uscrt',
    name: 'Secret Network',
    display: 'scrt',
    symbol: 'SCRT',
    coingecko_id: 'secret',
  },
];

export const SentinelAssets: ChainAsset[] = [
  {
    description: 'DVPN is the native token of the Sentinel Hub.',
    denom_units: [
      {
        denom: 'udvpn',
        exponent: 0,
      },
      {
        denom: 'dvpn',
        exponent: 6,
      },
    ],
    base: 'udvpn',
    name: 'Sentinel',
    display: 'dvpn',
    symbol: 'DVPN',
    coingecko_id: 'sentinel',
  },
];

export const StargazeAssets: ChainAsset[] = [
  {
    description: 'The native token of Stargaze',
    denom_units: [
      {
        denom: 'ustars',
        exponent: 0,
      },
      {
        denom: 'stars',
        exponent: 6,
      },
    ],
    base: 'ustars',
    name: 'Stargaze',
    display: 'stars',
    symbol: 'STARS',
    coingecko_id: 'stargaze',
  },
];

export const SifchainAssets: ChainAsset[] = [
  {
    description:
      "Rowan Token (ROWAN) is the Sifchain Network's native utility token, used as the primary means to govern, provide liquidity, secure the blockchain, incentivize participants, and provide a default mechanism to store and exchange value.",
    denom_units: [
      {
        denom: 'rowan',
        exponent: 18,
      },
    ],
    base: 'rowan',
    name: 'Sifchain Rowan',
    display: 'rowan',
    symbol: 'ROWAN',
    coingecko_id: 'sifchain',
  },
];
