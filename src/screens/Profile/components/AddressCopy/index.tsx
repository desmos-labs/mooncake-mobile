import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import { copyIcon } from 'assets/images';
import Clipboard from '@react-native-clipboard/clipboard';
import useStyles from './useStyles';

export interface AddressCopyProps {
  /**
   * The address that will be displayed & copiable.
   */
  readonly address: string;

  /**
   * A callback for parent components to extend the onPress action of this
   * component.
   */
  readonly externalCallback?: () => void;
}

/**
 * A component that displays an address and a copy icon.
 * When the copy icon is pressed, the address is copied within the device clipboard.
 * @constructor
 */
const AddressCopy = (props: AddressCopyProps) => {
  const styles = useStyles();

  const { address, externalCallback } = props;

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePress = React.useCallback(() => {
    Clipboard.setString(address);
    if (externalCallback) externalCallback();
  }, [address, externalCallback]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  // This is a simple component, so styles are left inline
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Typography.Body7 numberOfLines={1} ellipsizeMode="middle" style={styles.addressText}>
        {address}
      </Typography.Body7>

      <Image source={copyIcon} style={styles.copyIcon} />
    </TouchableOpacity>
  );
};

export default AddressCopy;
