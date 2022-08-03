import React from 'react';
import {useTranslation} from 'react-i18next';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {Image, View} from 'react-native';
import Button from 'components/Button';
import {errorImage} from 'assets/images';
import {useRecoilValue} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.NO_DTAG_FOUND>;

const NoDtagFound = () => {
  const {t} = useTranslation('noDtagFound');
  const styles = useStyles();
  const createLocalWallet = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);
  const {navigate} = useNavigation<NavProps['navigation']>();

  const handlePress = React.useCallback(() => {
    if (createLocalWallet || createLedgerAccount) {
      navigate(ROUTES.CREATE_DESMOS_PROFILE);
    }
  }, []);

  return (
    <DView style={styles.container}>
      <Image source={errorImage} style={styles.image} />
      <View style={styles.textGroup}>
        <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
        <Typography.Body6 style={styles.descriptionText}>
          {t('description')}
        </Typography.Body6>
      </View>

      <Button onPress={handlePress} mode="gradientFilled">
        {t('createDesmosProfile')}
      </Button>
    </DView>
  );
};

export default NoDtagFound;
