import React from 'react';
import { View } from 'react-native';
import Typography from '../Typography';
import useStyles from './useStyles';

type Props = {
  /**
   * Label to display on the left side
   */
  leftText: string;
  /**
   * Value to display on the right side
   */
  rightText: string;
};

// Unused component
const SectionText: React.FC<Props> = props => {
  const { leftText, rightText } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Button1 style={styles.label}>{leftText}</Typography.Button1>
      <Typography.Button1 style={styles.value}>{rightText}</Typography.Button1>
    </View>
  );
};

export default SectionText;
