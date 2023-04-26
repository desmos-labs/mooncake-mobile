import { makeStyle } from 'config/theme';
import React from 'react';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Props extends React.ComponentProps<typeof TouchableOpacity> {
  /**
   * The tint color of the back arrow.
   */
  iconColor?: ColorValue;
}

/**
 * A button with a back arrow image.
 */
export const BackButton: React.FC<Props> = ({ disabled, onPress, style, iconColor }) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      accessibilityLabel="back-button"
      hitSlop={{ top: 50, bottom: 50, right: 50, left: 50 }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}>
      <Icon
        name="angle-left"
        color={iconColor || theme.colors.surfaceBlack}
        size={32}
        allowFontScaling
      />
    </TouchableOpacity>
  );
};

const useStyles = makeStyle(() => ({
  button: {
    padding: 6,
  },
}));

export default BackButton;
