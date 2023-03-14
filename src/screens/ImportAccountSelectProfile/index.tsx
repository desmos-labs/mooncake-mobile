import TopBar from 'components/TopBar';
import React from 'react';
import DView from 'components/DView';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { SelectedAccount } from 'types/account';
import AccountPicker from 'screens/ImportAccountSelectProfile/components/AccountPicker';
import { AccountPickerParams } from './components/AccountPicker/types';

export interface SelectAccountParamList {
  accountPickerParams: AccountPickerParams;
  onSelect: (wallet: SelectedAccount) => any;
  onCancel?: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_PROFILE>;

/**
 * Screen that allows the user select a profile to import.
 */
const ImportAccountSelectProfile = ({ route: { params }, navigation }: NavProps) => {
  const { accountPickerParams, onSelect, onCancel } = params;
  const { t } = useTranslation('selectProfile');

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (e.data.action.type === 'GO_BACK' && onCancel !== undefined) {
          onCancel();
        }
      }),
    [navigation, onCancel],
  );

  return (
    <DView topBar={<TopBar />}>
      <Spacer paddingHorizontal={16} paddingTop={16}>
        <Typography.H4>{t('header')}</Typography.H4>
      </Spacer>
      <AccountPicker onAccountSelected={onSelect} params={accountPickerParams} />
    </DView>
  );
};

export default ImportAccountSelectProfile;
