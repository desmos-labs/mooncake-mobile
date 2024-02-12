import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, ImageSourcePropType, Switch, View } from 'react-native';
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
   * The switch icon:
   */
  leftIcon?: ImageSourcePropType;
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
  const { label, value, leftIcon, disabled, onValueChange } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {leftIcon !== undefined && <Image style={styles.icon} source={leftIcon} />}
      <Typography.Regular16 style={[styles.label, disabled ? styles.disabled : null]}>
        {label}
      </Typography.Regular16>
      <Switch
        value={value}
        trackColor={{ true: theme.colors.primary }}
        thumbColor="white"
        disabled={disabled}
        onChange={onValueChange}
      />
    </View>
  );
};

export default SectionSwitch;
