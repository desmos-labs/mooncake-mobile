import React from 'react';
import {AccessibilityProps, Image, TouchableOpacity} from 'react-native';
import {ledgerIcon} from 'assets/images';
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
  onPress: () => void;
}

/**
 * A component used to render individual ledger devices discovered while the
 * user is on the LookingForDevices screen.
 */
const LedgerDeviceItem = ({name, onPress, ...rest}: Props) => {
  const {nameStyle, container, ledgerIconStyle} = useStyles();

  return (
    <TouchableOpacity style={container} onPress={onPress} {...rest}>
      <Image source={ledgerIcon} style={ledgerIconStyle} />
      <Typography.Subtitle style={nameStyle}>{name}</Typography.Subtitle>
    </TouchableOpacity>
  );
};

export default LedgerDeviceItem;
