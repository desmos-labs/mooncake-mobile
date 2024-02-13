import { useTheme } from '@react-navigation/native';
import { check_circle, uncheck_circle } from 'assets/images';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Image, Pressable } from 'react-native';

interface Props {
  style?: any;
  value?: boolean;
  disabled?: boolean;
  onValueChange?: (value: boolean) => void;
}

const BCheckbox = ({ style, value, disabled, onValueChange }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  const onPress = React.useMemo(() => {
    if (onValueChange) {
      return () => onValueChange(!value || false);
    } else {
      return undefined;
    }
  }, [onValueChange, value]);

  const tintColor = React.useMemo(() => {
    if (disabled) {
      return theme.colors.neutralVariants['400'];
    } else {
      if (value) {
        return theme.colors.primary;
      }
      return theme.colors.neutralVariants['700'];
    }
  }, [disabled, theme.colors.neutralVariants, theme.colors.primary, value]);

  return (
    <Pressable
      // Announces "checked" status and "checkbox" as the focused element
      accessibilityRole="checkbox"
      style={style}
      disabled={disabled || onPress === undefined}
      onPress={onPress}>
      <Image
        tintColor={tintColor}
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
