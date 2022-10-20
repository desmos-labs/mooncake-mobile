import {desmosIcon, twitterIconBlack} from 'assets/images';
import {ImageSourcePropType} from 'react-native';

const appsIconMap: {[index: string]: ImageSourcePropType} = {
  twitter: twitterIconBlack,
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
