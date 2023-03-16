import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import { useTheme } from 'native-base';
import { copyIcon } from 'assets/images';
import Clipboard from '@react-native-clipboard/clipboard';

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
  const theme = useTheme();

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
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Typography.Body7
        numberOfLines={1}
        ellipsizeMode="middle"
        style={{ maxWidth: '35%', color: theme.colors.darkGrey }}>
        {address}
      </Typography.Body7>

      <Image
        source={copyIcon}
        style={{
          marginLeft: 6,
          width: 16,
          height: 16,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default AddressCopy;
