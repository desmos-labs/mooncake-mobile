import { makeStyleWithProps } from 'config/theme';
import { Image } from 'expo-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import { Skeleton, View } from 'native-base';
import React from 'react';
import { DesmosProfile } from 'types/desmos';

interface ProfileImageProps {
  /**
   * The image to display.
   * Can be obtained from a {@link DesmosProfile} or from a remote url.
   */
  readonly imageSource: DesmosProfile | string | undefined;
  /**
   * Image size.
   * If undefined will fallback to 24.
   */
  readonly size?: number;
  /**
   * Tells if the item should display in disable mode.
   */
  readonly disabled?: boolean;
}

const DefaultSize = 24;

/**
 * Component that displays a user's profile picture.
 */
const ProfileImage: React.FC<ProfileImageProps> = ({ imageSource, size, disabled }) => {
  // -----------------------------------------------------
  // ----- States
  // -----------------------------------------------------

  const imageSize = size ?? DefaultSize;
  const styles = useStyles({ size: imageSize, disabled });
  const [loading, setLoading] = React.useState(false);

  // -----------------------------------------------------
  // ----- Variables
  // -----------------------------------------------------

  const profileImage = React.useMemo(() => {
    if (typeof imageSource === 'string') {
      return imageSource;
    }

    return getProfilePicture(imageSource);
  }, [imageSource]);

  // -----------------------------------------------------
  // ----- Callbacks
  // -----------------------------------------------------

  const onLoadStart = React.useCallback(() => {
    console.log('on load start');
    setLoading(true);
  }, []);

  const onLoadEnd = React.useCallback(() => {
    console.log('on load end');
    setLoading(false);
  }, []);

  // -----------------------------------------------------
  // ----- Effects
  // -----------------------------------------------------

  React.useEffect(() => {
    // Reset the component state when unmounted
    // to support component recycling.
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <View>
      {loading && <Skeleton style={styles.skeleton} size={imageSize / 4} rounded="full" />}
      <Image
        style={styles.image}
        source={profileImage}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
      />
    </View>
  );
};

export default ProfileImage;

interface StyleProps {
  readonly size: number;
  readonly disabled?: boolean;
}

const useStyles = makeStyleWithProps((props: StyleProps) => ({
  image: {
    width: props.size,
    height: props.size,
    borderRadius: props.size,
    opacity: props.disabled ? 0.3 : 1,
  },
  skeleton: {
    position: 'absolute',
    zIndex: 99,
  },
}));
