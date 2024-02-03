import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { walletIcon } from 'assets/images';
import { makeStyle } from 'config/theme';
import { Image } from 'expo-image';
import useNavigateToProfileOperations from 'hooks/navigation/useNavigateToProfileOperations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

const WalletButton = ({ address }: { address: string }) => {
  const navigateToProfileOperations = useNavigateToProfileOperations();
  const { t } = useTranslation('profile');
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={() => navigateToProfileOperations(address)} style={styles.button}>
      <Image source={walletIcon} style={styles.walletIcon} />
      <Typography.Regular14 style={styles.text}>{t('wallet')}</Typography.Regular14>
    </TouchableOpacity>
  );
};

export default WalletButton;

const useStyles = makeStyle(theme => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.butterOrange05,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    width: 88,
  },
  walletIcon: {
    width: 24,
    height: 24,
  },
  text: {
    color: theme.colors.primary,
  },
}));
