import React from 'react';
import {Image, ImageProps, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Typography from '../Typography';
import useStyles from './useStyles';

export type Props = {
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
  rightIconName?: string;
};

const SectionButton: React.FC<Props> = props => {
  const {label, onPress, leftIcon, rightIconName} = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.root} onPress={onPress ?? onPress}>
      {leftIcon && (
        <Image style={styles.icon} source={leftIcon} resizeMode="contain" />
      )}
      <Typography.Button1 style={styles.label}>{label}</Typography.Button1>
      <Icon
        name={rightIconName || 'angle-right'}
        color={theme.colors.icon[1]}
        size={24}
        allowFontScaling
      />
    </TouchableOpacity>
  );
};

export default SectionButton;
