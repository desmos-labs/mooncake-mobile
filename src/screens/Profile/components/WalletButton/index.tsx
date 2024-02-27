import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { walletIcon } from 'assets/images';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import useStyles from './useStyles';

interface Props {
  readonly onPressButton: () => void;
}

const WalletButton = ({ onPressButton }: Props) => {
  const { t } = useTranslation('profile');
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={onPressButton} style={styles.button}>
      <Image source={walletIcon} style={styles.icon} />
      <Typography.Regular14 style={styles.text}>{t('wallet')}</Typography.Regular14>
    </TouchableOpacity>
  );
};

export default WalletButton;
