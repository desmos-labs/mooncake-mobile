import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import {useTheme} from 'react-native-paper';
import {copyIcon} from 'assets/images';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = {
  /**
   * The address that will be displayed & copiable.
   */
  address: string;

  /**
   * A callback for parent components to extend the onPress action of this
   * component.
   */
  externalCallback?: () => void;
};

const AddressCopy = ({address, externalCallback}: Props) => {
  const theme = useTheme();

  const handlePress = React.useCallback(() => {
    if (externalCallback) externalCallback();

    Clipboard.setString(address);
  }, [address, externalCallback]);

  // This is a simple component, so styles are left inline
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography.Body7
        numberOfLines={1}
        ellipsizeMode="middle"
        style={{maxWidth: '40%', color: theme.colors.font[3]}}>
        {address}
      </Typography.Body7>

      <Image
        source={copyIcon}
        style={{
          width: 16,
          height: 16,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default AddressCopy;
