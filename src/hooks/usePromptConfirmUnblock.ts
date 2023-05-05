import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useActiveAccountAddress } from '@recoil/accounts';
import ROUTES from 'navigation/routes';
import { err, ok, Result } from 'neverthrow';
import { CanceledBlockError, CanceledOperationError } from 'types/error';
import { bool } from 'yup';
import { EncodeObject } from '@cosmjs/proto-signing';

const usePromptConfirmUnblock = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccountAddress = useActiveAccountAddress();

  return React.useCallback(
    async (userToUnblock: string) => {
      if (!activeAccountAddress) {
        throw new Error('Unblock user without an active account');
      }

      return new Promise<Result<Boolean, Error>>(resolve => {
        navigation.navigate(ROUTES.UNBLOCK_CONFIRMATION_MODAL, {
          onPressYes: () => resolve(ok(true)),
          onPressNo: () => resolve(err(new CanceledBlockError())),
          onDismiss: () => resolve(err(new CanceledOperationError())),
          userToUnblock,
        });
      });
    },
    [activeAccountAddress, navigation],
  );
};

export default usePromptConfirmUnblock;
