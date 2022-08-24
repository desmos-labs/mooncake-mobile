import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
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

const MenuButton = ({onPress, interactionCount, icon}: Props) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Typography.Subtitle3 style={styles.countText}>
        {formatNumShorthand(interactionCount)}
      </Typography.Subtitle3>
    </TouchableOpacity>
  );
};

export default MenuButton;
