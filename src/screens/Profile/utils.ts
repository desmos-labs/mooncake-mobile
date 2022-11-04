import {ImageSourcePropType} from 'react-native';
import LinkableChains from 'config/LinkableChains';
import {defaultProfilePic, twitterIcon} from 'assets/images';
import {Source} from 'react-native-fast-image';
import {ChainLink} from 'types/link';

export const mapConnectedChainImages = (
  connectedChains: ChainLink[],
): Source[] => {
  return connectedChains.map(
    x =>
      LinkableChains.find(y => y.chainConfig.name === x.chainName)?.icon ||
      defaultProfilePic,
  );
};

export const mapConnectedAppImages = (
  connectedApps: ConnectedApps[],
): Source[] => {
  const imageMap: {[index: string]: ImageSourcePropType} = {
    twitter: twitterIcon,
  };

  return connectedApps.map(x => imageMap[x.application] || defaultProfilePic);
};
