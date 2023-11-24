import { ImageStyle, StyleProp } from 'react-native';
import { DesmosProfile } from 'types/desmos';

interface AvatarImageProps {
  /**
   * Profile for which to display the image.
   */
  profile: DesmosProfile | undefined;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Callback called when the user press on the avatar image.
   */
  onPress?: () => void;
  /**
   * True if we should display a loading indicator over the image.
   */
  loading?: boolean;
  style?: StyleProp<ImageStyle>;
}

export default AvatarImageProps;
