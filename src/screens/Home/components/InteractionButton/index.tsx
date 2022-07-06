import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Typography from 'components/Typography';
import LinearGradient from 'react-native-linear-gradient';
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

/**
 * Very naive way to format interactionCount into something like 5000 > 5k
 */
const formatCount = (count: number) => {
  if (count < 1000) {
    return count;
  }
  if (count < 1000000) return `${count / 1000}k`;
  return `${count / 1000000}m`;
};

const InteractionButton = ({onPress, interactionCount, icon}: Props) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={[
          'rgba(255, 199, 91, 1)',
          'rgba(255, 132, 79, 1)',
          'rgba(255, 132, 79, 1)',
          'rgba(255, 132, 79, 1)',
        ]}
        style={StyleSheet.absoluteFillObject}
      />
      <Image source={icon} style={styles.icon} />
      <Typography.Subtitle3 style={styles.countText}>
        {formatCount(interactionCount)}
      </Typography.Subtitle3>
    </TouchableOpacity>
  );
};

export default InteractionButton;
