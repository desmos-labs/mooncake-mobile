import React from 'react';
import {View} from 'react-native';
import Typography from '../Typography';
import useStyles from './useStyles';

export type Props = {
  /**
   * Label to display on the left side
   */
  label: string;
  /**
   * Value to display on the right side
   */
  value: string;
};

const SectionText: React.FC<Props> = props => {
  const {label, value} = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Button1 style={styles.label}>{label}</Typography.Button1>
      <Typography.Button1 style={styles.value}>{value}</Typography.Button1>
    </View>
  );
};

export default SectionText;
