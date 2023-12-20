import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'native-base';
import React from 'react';
import { Image, ImageProps, TouchableOpacity } from 'react-native';
import Typography from '../Typography';
import useStyles from './useStyles';

type Props = {
  /**
   * The button label
   */
  label: string;
  onPress?: () => void;
  /**
   * This will change based on how we manage custom icons
   */
  leftIcon?: ImageProps['source'];
  /**
   * This will change based on how we manage custom icons
   */
  rightIconName?: any;
};

const SectionButton: React.FC<Props> = props => {
  const { label, onPress, leftIcon, rightIconName } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.root} onPress={onPress ?? onPress}>
      {leftIcon && <Image style={styles.icon} source={leftIcon} resizeMode="contain" />}
      <Typography.Subtitle2 style={styles.label}>{label}</Typography.Subtitle2>
      <FontAwesome
        name={rightIconName || 'angle-right'}
        color={theme.colors.surfaceBlack}
        size={24}
        allowFontScaling
      />
    </TouchableOpacity>
  );
};

export default SectionButton;
