import StyledSpinner from 'components/StyledSpinner';
import { Image } from 'expo-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import AvatarImageProps from './props';
import useStyles from './useStyles';

/**
 * Component that allows displaying a Desmos Profile picture.
 * @constructor
 */
const AvatarImage: React.FC<AvatarImageProps> = props => {
  const { profile, onPress, style, loading } = props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
          style={[style, styles.image]}
          source={getProfilePicture(profile)}
          contentFit="cover"
        />
        {loading === true && <StyledSpinner style={styles.indicator} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AvatarImage;
