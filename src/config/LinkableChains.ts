import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { SupportedChain } from 'types/chains';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import { desmosIcon } from 'assets/images';
import { Slip10RawIndex } from '@cosmjs/crypto';

const DesmosChain: SupportedChain = {
  name: 'Desmos',
  prefix: 'desmos',
  masterHDPath: [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(852),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
  ],
  icon: desmosIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'desmos',
  }),
  chainInfo: [DesmosTestnet, DesmosMainnet],
};

export default DesmosChain;
