import { check_circle, uncheck_circle } from 'assets/images';
import { makeStyle } from 'config/theme';
import { useTheme } from 'native-base';
import React from 'react';
import { Image, Pressable } from 'react-native';

interface Props {
  style?: any;
  value?: boolean;
  onValueChange: (value: boolean) => void;
}

const BCheckbox = ({ style, value, onValueChange }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Pressable
      // Announces "checked" status and "checkbox" as the focused element
      accessibilityRole="checkbox"
      style={style}
      onPress={() => onValueChange(!value || false)}>
      <Image
        tintColor={value ? undefined : theme.colors.surfaceBlack}
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
