import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { makeStyle } from 'config/theme';
import CommonStyles from 'config/theme/CommonStyles';
import React from 'react';
import { ColorValue } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props extends React.ComponentProps<typeof TouchableOpacity> {
  /**
   * The tint color of the back arrow.
   */
  iconColor?: ColorValue;
}

/**
 * A button with a back arrow image.
 */
const BackButton: React.FC<Props> = ({ disabled, onPress, style, iconColor }) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      accessibilityLabel="back-button"
      hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}>
      <FontAwesome
        name="angle-left"
        style={disabled && CommonStyles.opacity['50']}
        color={iconColor || theme.colors.neutralVariants['900']}
        size={30}
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
