import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import GetChainIcon from 'lib/GetChainIcon';
import Typography from 'components/Typography';
import {copyIcon} from 'assets/images';
import Clipboard from '@react-native-clipboard/clipboard';
import useStyles from './useStyles';

type Props = {
  chainName: string;

  address: string;

  onPressDisconnect: () => void;

  showSnackBar: () => void;
};

const ChainLinkItem = ({
  chainName,
  address,
  onPressDisconnect,
  showSnackBar,
}: Props) => {
  const styles = useStyles();

  const onPressCopy = React.useCallback(() => {
    showSnackBar();
    Clipboard.setString(address);
  }, [address]);

  const capitalizedFirstLetter = React.useMemo(() => {
    const [firstLetter, ...restOfString] = chainName;

    return firstLetter.toUpperCase().concat(...restOfString);
  }, [chainName]);

  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={GetChainIcon(chainName)} />

      <View style={styles.centerGroup}>
        <Typography.Subtitle style={styles.baseText}>
          {capitalizedFirstLetter}
        </Typography.Subtitle>
        <View style={styles.addressGroup}>
          <Typography.Caption
            style={styles.baseText}
            numberOfLines={1}
            ellipsizeMode="middle">
            {address}
          </Typography.Caption>

          <TouchableOpacity
            accessibilityLabel="copy address button"
            onPress={onPressCopy}>
            <Image style={styles.copyIcon} source={copyIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.disconnectButton}>
        <TouchableOpacity onPress={onPressDisconnect}>
          <Typography.Body1 style={styles.disconnectText}>
            Disconnect
          </Typography.Body1>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChainLinkItem;
