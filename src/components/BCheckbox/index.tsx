import { check_circle, uncheck_circle } from 'assets/images';
import { makeStyle } from 'config/theme';
import { useTheme } from 'native-base';
import React from 'react';
import { Image, Pressable } from 'react-native';

interface Props {
  style?: any;
  value?: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

const BCheckbox = ({ style, value, disabled, onValueChange }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Pressable
      // Announces "checked" status and "checkbox" as the focused element
      accessibilityRole="checkbox"
      style={style}
      disabled={disabled}
      onPress={() => onValueChange(!value || false)}>
      <Image
        tintColor={disabled ? theme.colors.lightGrey02 : theme.colors.surfaceBlack}
        source={value ? check_circle : uncheck_circle}
        style={styles.icon}
      />
    </Pressable>
  );
};

const useStyles = makeStyle(() => ({
  icon: {
    width: 24,
    height: 24,
  },
}));

export default BCheckbox;
