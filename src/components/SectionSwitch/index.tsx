import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Switch, useTheme } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

type Props = {
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
  const { label, value, disabled, onValueChange } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Typography.Regular16 style={[styles.label, disabled ? styles.disabled : null]}>
        {label}
      </Typography.Regular16>
      <Switch
        isChecked={value}
        trackColor={{ true: theme.colors.butterOrange01 }}
        thumbColor="white"
        isDisabled={disabled}
        onToggle={onValueChange}
      />
    </View>
  );
};

export default SectionSwitch;
