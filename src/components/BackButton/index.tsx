import {makeStyle} from 'config/theme';
import React from 'react';
import {ColorValue, StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: ColorValue;
};

export const BackButton: React.FC<Props> = ({onPress, style, iconColor}) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      hitSlop={{top: 50, bottom: 50, right: 50, left: 50}}
      onPress={onPress}
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
