import {desmosIcon, twitterIcon} from 'assets/images';
import {ImageSourcePropType} from 'react-native';

const appsIconMap: {[index: string]: ImageSourcePropType} = {
  twitter: twitterIcon,
};

/**
 * A helper function that returns an app's icon image, or the desmos icon
 * by default.
 *
 * @param appName The name of the app
 */
const GetAppIcon = (appName: string): ImageSourcePropType => {
  return appsIconMap[appName] || desmosIcon;
};

export default GetAppIcon;
