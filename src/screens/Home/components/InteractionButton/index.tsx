import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import useStyles from './useStyles';

type Props = {
  /**
   * What to do if the button is pressed.
   */
  onPress: () => void;

  /**
   * The number of corresponding interactions.
   */
  interactionCount: number;

  /**
   * An image that will be rendered on the button
   */
  icon: ImageSourcePropType;
};

const InteractionButton = ({onPress, interactionCount, icon}: Props) => {
  const styles = useStyles();

  return (
    <Shadow
      finalColor="rgba(133, 133, 133, 0)"
      startColor="rgba(133, 133, 133, 0.13)"
      distance={12}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image source={icon} style={styles.icon} />
        <Typography.Subtitle3 style={styles.countText}>
          {formatNumShorthand(interactionCount)}
        </Typography.Subtitle3>
      </TouchableOpacity>
    </Shadow>
  );
};

export default InteractionButton;
