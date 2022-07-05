import React from 'react';
import {Image, ImageProps, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
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
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <MaterialCommunityIcon
        name={rightIconName || 'arrow-right'}
        color={theme.colors.icon[3]}
        size={20}
        direction="ltr"
        allowFontScaling
      />
    </TouchableOpacity>
  );
};

export default SectionButton;
