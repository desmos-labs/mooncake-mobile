import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Typography from 'components/Typography';
import LinearGradient from 'react-native-linear-gradient';
import {formatNumShorthand} from 'lib/FormatUtils';
import {useTheme} from 'react-native-paper';
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
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={theme.colors.butterOrangeGradient01}
        style={StyleSheet.absoluteFillObject}
      />
      <Image source={icon} style={styles.icon} />
      <Typography.Subtitle3 style={styles.countText}>
        {formatNumShorthand(interactionCount)}
      </Typography.Subtitle3>
    </TouchableOpacity>
  );
};

export default InteractionButton;
