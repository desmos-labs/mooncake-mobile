import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useActiveAccountAddress } from '@recoil/accounts';
import ROUTES from 'navigation/routes';
import { err, ok, Result } from 'neverthrow';
import { CanceledBlockError, CanceledOperationError } from 'types/error';
import { useTranslation } from 'react-i18next';

/**
 * A hook that prompts the user to confirm an unblock operation.
 */
const usePromptConfirmUnblock = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccountAddress = useActiveAccountAddress();
  const { t } = useTranslation('unblock');

  return React.useCallback(
    async (userToUnblock: string) => {
      if (!activeAccountAddress) {
        throw new Error('Unblock user without an active account');
      }

      return new Promise<Result<boolean, Error>>(resolve => {
        navigation.navigate(ROUTES.CONFIRM_MODAL, {
          onPressPrimary: () => resolve(ok(true)),
          onPressSecondary: () => resolve(err(new CanceledBlockError())),
          onDismiss: () => resolve(err(new CanceledOperationError())),
          title: t('unblock'),
          primaryButtonLabel: t('unblock'),
          secondaryButtonLabel: t('common:no'),
          subtitle: t('content', { username: userToUnblock }),
          removeModalAfterButtonPress: true,
        });
      });
    },
    [activeAccountAddress, navigation, t],
  );
};

export default usePromptConfirmUnblock;
