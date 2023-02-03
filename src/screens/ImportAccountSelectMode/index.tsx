import { StackScreenProps } from '@react-navigation/stack';
import { landingBG } from 'assets/images';
import DView from 'components/DView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import Button from 'components/Button';
import { useImportAccountState, useSetImportAccountState } from '@recoil/importAccountState';
import { WalletType } from 'types/wallet';
import { MNEMONIC_INPUT_MODE } from 'screens/MnemonicInput';
import useOnBackAction from 'hooks/useOnBackAction';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_MODE>;

const ImportAccountSelectMode = ({ navigation }: NavProps) => {
  const styles = useStyles();
  const setImportAccountState = useSetImportAccountState();
  const importAccountState = useImportAccountState()!;

  useOnBackAction(importAccountState.onCancel, []);

  const onImportWithMnemonic = React.useCallback(() => {
    setImportAccountState(currVal => ({
      ...currVal!,
      importMode: WalletType.Mnemonic,
    }));
    navigation.navigate(ROUTES.MNEMONIC_INPUT, {
      mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
    });
  }, [setImportAccountState]);

  const onImportWithLedger = React.useCallback(() => {
    // TODO: Implement import with Ledger.
    console.warn('Implement import with Ledger');
  }, [setImportAccountState]);

  return (
    <DView backgroundImage={landingBG} backgroundFillScreen style={styles.container}>
      <Button onPress={onImportWithMnemonic} mode="contained">
        Mnemonic
      </Button>
      <Button onPress={onImportWithLedger} mode="contained">
        Ledger
      </Button>
    </DView>
  );
};

export default ImportAccountSelectMode;
