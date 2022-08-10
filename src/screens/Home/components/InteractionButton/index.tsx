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
  mode: 'text' | 'gradient';
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

const InteractionButton = ({mode, onPress, interactionCount, icon}: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return mode === 'gradient' ? (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={theme.colors.dOrangeGradient01}
        style={StyleSheet.absoluteFillObject}
      />
      <Image source={icon} style={styles.icon} />
      <Typography.Subtitle3 style={styles.countText}>
        {formatNumShorthand(interactionCount)}
      </Typography.Subtitle3>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icon} style={styles.iconBlack} />
      <Typography.Subtitle3
        style={[styles.countText, {color: theme.colors.desmosOrange01}]}>
        {formatNumShorthand(interactionCount)}
      </Typography.Subtitle3>
    </TouchableOpacity>
  );
};

export default InteractionButton;
