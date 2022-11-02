import {ImageSourcePropType} from 'react-native';
import LinkableChains from 'config/LinkableChains';
import {defaultProfilePic, twitterIcon} from 'assets/images';
import {ChainLink} from 'types/link';

export const mapConnectedChainImages = (
  connectedChains: ChainLink[],
): ImageSourcePropType[] => {
  return connectedChains.map(
    x =>
      LinkableChains.find(y => y.chainConfig.name === x.chainName)?.icon ||
      defaultProfilePic,
  );
};

export const mapConnectedAppImages = (
  connectedApps: ConnectedApps[],
): ImageSourcePropType[] => {
  const imageMap: {[index: string]: ImageSourcePropType} = {
    twitter: twitterIcon,
  };

  return connectedApps.map(x => imageMap[x.application] || defaultProfilePic);
};
