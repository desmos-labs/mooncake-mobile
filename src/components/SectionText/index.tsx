import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import React from 'react';
import { View } from 'react-native';
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
      <Typography.Regular16 style={styles.label}>{leftText}</Typography.Regular16>
      <Typography.Regular16 style={styles.value}>{rightText}</Typography.Regular16>
    </View>
  );
};

export default SectionText;
