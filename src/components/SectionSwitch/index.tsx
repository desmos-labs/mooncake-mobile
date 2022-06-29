import React from 'react';
import {View} from 'react-native';
import {Switch} from 'react-native-paper';
import Typography from '../Typography';
import useStyles from './useStyles';

export type Props = {
  /**
   * The switch label
   */
  label: string;
  /**
   * The switch value (true/false)
   */
  value: boolean;
  /**
   * True to disable the switch (opacity 0.3)
   */
  disabled: boolean;
};

const SectionSwitch: React.FC<Props> = props => {
  const {label, value, disabled} = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1
        style={[styles.label, disabled ? styles.disabled : null]}>
        {label}
      </Typography.Body1>
      <Switch value={value} disabled={disabled} />
    </View>
  );
};

export default SectionSwitch;
