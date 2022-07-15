import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import GetChainIcon from 'lib/GetChainIcon';
import Typography from 'components/Typography';
import {copyIcon} from 'assets/images';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';
import DropShadowWrapper from 'components/DropShadowWrapper';
import useStyles from './useStyles';

type Props = {
  /**
   * The name of the chain. Component will map the icon or show a cosmos icon
   * if a matching image cannot be found. See lib/GetChainIcon for more details.
   */
  chainName: string;

  /**
   * The address of the connected account.
   */
  address: string;

  /**
   * What to do when the user presses the Disconnect button.
   */
  onPressDisconnect: () => void;

  /**
   * A callback to show the snackbar on the parent container when the copy
   * button is pressed.
   */
  showSnackBar: () => void;
};

const ChainLinkItem = ({
  chainName,
  address,
  onPressDisconnect,
  showSnackBar,
}: Props) => {
  const {t} = useTranslation('common');
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
    <DropShadowWrapper>
      <View style={styles.container}>
        <Image style={styles.icon} source={GetChainIcon(chainName)} />

        <View style={styles.centerGroup}>
          <Typography.H5 style={styles.baseText}>
            {capitalizedFirstLetter}
          </Typography.H5>
          <View style={styles.addressGroup}>
            <Typography.Body7
              style={styles.baseText}
              numberOfLines={1}
              ellipsizeMode="middle">
              {address}
            </Typography.Body7>

            <TouchableOpacity
              accessibilityLabel="copy address button"
              onPress={onPressCopy}>
              <Image style={styles.copyIcon} source={copyIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.disconnectButton}>
          <TouchableOpacity onPress={onPressDisconnect}>
            <Typography.Subtitle4 style={styles.disconnectText}>
              {t('disconnect')}
            </Typography.Subtitle4>
          </TouchableOpacity>
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default ChainLinkItem;
