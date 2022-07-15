import React from 'react';
import {View} from 'react-native';
import {Switch, useTheme} from 'react-native-paper';
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
  disabled?: boolean;
  /**
   * Callback that receives the new value as an argument
   */
  onValueChange: () => void;
};

const SectionSwitch: React.FC<Props> = props => {
  const {label, value, disabled, onValueChange} = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Typography.Button1
        style={[styles.label, disabled ? styles.disabled : null]}>
        {label}
      </Typography.Button1>
      <Switch
        value={value}
        trackColor={{true: theme.colors.desmosOrange01}}
        thumbColor="white"
        disabled={disabled}
        onValueChange={onValueChange}
      />
    </View>
  );
};

export default SectionSwitch;
