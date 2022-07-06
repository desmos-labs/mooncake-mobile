import React from 'react';
import {AccessibilityProps, Image, TouchableOpacity, View} from 'react-native';
import {checkboxIcon, ledgerIcon} from 'assets/images';
import Typography from 'components/Typography';
import useStyles from './useStyles';

interface Props extends AccessibilityProps {
  /**
   * The name of the Ledger Device
   */
  name: string;

  /**
   * OnPress callback of the button.
   */
  onPress?: () => void;

  /**
   * Whether to show a blue checkmark
   */
  showCheck?: boolean;
}

/**
 * A component used to render individual ledger devices discovered while the
 * user is on the LookingForDevices screen.
 */
const LedgerDeviceItem = ({name, onPress, showCheck, ...rest}: Props) => {
  const {
    leftContainer,
    nameStyle,
    container,
    ledgerIconStyle,
    hidden,
    checkImage,
  } = useStyles();

  return (
    <TouchableOpacity
      style={container}
      onPress={onPress || undefined}
      disabled={!onPress}
      {...rest}>
      <View style={leftContainer}>
        <Image source={ledgerIcon} style={ledgerIconStyle} />

        <Typography.Subtitle style={nameStyle}>{name}</Typography.Subtitle>
      </View>

      <Image source={checkboxIcon} style={[checkImage, !showCheck && hidden]} />
    </TouchableOpacity>
  );
};

export default LedgerDeviceItem;
