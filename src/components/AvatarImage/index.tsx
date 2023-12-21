import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import BImage from 'components/BImage';
import { getProfilePicture } from 'lib/ProfileUtils';
import BSkeleton from 'components/BSkeleton';
import useStyles from './useStyles';
import AvatarImageProps from './props';

/**
 * Component that allows displaying a Desmos Profile picture.
 * @constructor
 */
const AvatarImage: React.FC<AvatarImageProps> = props => {
  const { profile, onPress, style, loading } = props;
  const styles = useStyles(props);

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={!onPress ? 1 : 0.2}>
      <BSkeleton show={loading} radius="round" disableExitAnimation={true}>
        <View style={styles.container}>
          <BImage
            style={[style!, styles.image]}
            source={loading ? undefined : getProfilePicture(profile)}
            responsivePolicy="initial"
            recyclingKey={profile?.profilePicture}
            skeletonRadius="round"
          />
        </View>
      </BSkeleton>
    </TouchableOpacity>
  );
};

export default AvatarImage;
