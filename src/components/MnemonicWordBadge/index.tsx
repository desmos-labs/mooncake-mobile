import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import useStyles from './useStyles';
import Typography from '../Typography';

export type Props = {
  /**
   * The word to display.
   */
  value: string;
  /**
   * An optional word index that will be displayed on the top right corner.
   */
  index?: number;
  /**
   * Function called when the badge is pressed.
   */
  onPress?: (word: string) => void;
  style?: StyleProp<ViewStyle>;
};

const MnemonicWordBadge: React.FC<Props> = props => {
  const {value, index, onPress, style} = props;
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.root as StyleProp<ViewStyle>, style)}
      onPress={
        onPress
          ? () => {
              onPress!(value);
            }
          : undefined
      }>
      <Typography.Subtitle1>{value}</Typography.Subtitle1>
      <Text style={styles.index}>{index}</Text>
    </TouchableOpacity>
  );
};

export default MnemonicWordBadge;
