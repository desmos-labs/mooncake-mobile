import {
  akashIcon,
  bandIcon,
  bitcannaIcon,
  cosmosIcon,
  cryptoComIcon,
  desmosIcon,
  eMoneyIcon,
  junoIcon,
  kavaIcon,
  likecoinIcon,
  osmosisIcon,
  regenIcon,
  terraIcon,
} from 'assets/images';
import {ImageSourcePropType} from 'react-native';

const chainIconMap: {[index: string]: ImageSourcePropType} = {
  akash: akashIcon,
  bitcanna: bitcannaIcon,
  band: bandIcon,
  cosmos: cosmosIcon,
  cryptoCom: cryptoComIcon,
  desmos: desmosIcon,
  eMoney: eMoneyIcon,
  juno: junoIcon,
  kava: kavaIcon,
  likecoin: likecoinIcon,
  osmosis: osmosisIcon,
  regen: regenIcon,
  terra: terraIcon,
};

/**
 * A helper function that returns a chain's icon image, or the cosmos icon
 * by default.
 *
 * @param chainName The name of the chain
 */
const GetChainIcon = (chainName: string): ImageSourcePropType => {
  return chainIconMap[chainName] || cosmosIcon;
};

export default GetChainIcon;
