import { StackScreenProps } from '@react-navigation/stack';
import {
  useImportAccountState,
  useSetImportAccountState,
} from '@recoil/screens/importAccountState';
import { connectLedger, importPhrase } from 'assets/images';
import DView from 'components/DView';
import ShadowButton from 'components/ShadowButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WalletType } from 'types/wallet';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_MODE>;

/**
 * Screen that allows the user select how an account should be imported.
 */
const ImportAccountSelectMode = (props: NavProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('importAccountSelectMode');
  const { navigation } = props;

  const setImportAccountState = useSetImportAccountState();
  const importAccountState = useImportAccountState()!;

  useOnBackAction(importAccountState.onCancel, []);

  const onImportWithMnemonic = React.useCallback(() => {
    setImportAccountState(currVal => ({
      ...currVal!,
      importMode: WalletType.Mnemonic,
    }));
    navigation.navigate(ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT);
  }, [navigation, setImportAccountState]);

  const onImportWithLedger = React.useCallback(() => {
    setImportAccountState(currVal => ({
      ...currVal!,
      importMode: WalletType.Ledger,
    }));
    navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP);
  }, [navigation, setImportAccountState]);

  const onImportWithPrivateKey = React.useCallback(() => {
    setImportAccountState(currVal => ({
      ...currVal!,
      importMode: WalletType.Ledger,
    }));
    navigation.navigate(ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY_INPUT);
  }, [navigation, setImportAccountState]);

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H3>{t('header')}</Typography.H3>
      <Spacer paddingVertical={theme.spacing.m} />
      {__DEV__ && (
        <>
          <ShadowButton
            buttonImage={importPhrase}
            buttonText={t('import recovery phrase')}
            handlePress={onImportWithMnemonic}
          />
          <Spacer paddingBottom={theme.spacing.l} />
        </>
      )}
      <ShadowButton
        buttonImage={importPhrase}
        buttonText={t('import private key')}
        handlePress={onImportWithPrivateKey}
      />
      <Spacer paddingBottom={theme.spacing.l} />
      {__DEV__ && (
        <ShadowButton
          buttonImage={connectLedger}
          buttonText={t('connect ledger')}
          handlePress={onImportWithLedger}
        />
      )}
    </DView>
  );
};

export default ImportAccountSelectMode;
