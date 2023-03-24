import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import StyledSpinner from 'components/StyledSpinner';
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
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <FastImage
          style={[style, styles.image]}
          source={getProfilePicture(profile)}
          resizeMode="cover"
        />
        {loading === true && <StyledSpinner style={styles.indicator} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AvatarImage;
