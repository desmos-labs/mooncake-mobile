import { useTranslation } from 'react-i18next';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { DesmosProfile } from 'types/desmos';
import { err, ok, Result } from 'neverthrow';
import { CanceledOperationError } from 'types/error';
import ROUTES from 'navigation/routes';

/**
 * Hook that provides a function that shows to the user that must create
 * a profile to perform the operation and let the user create the profile.
 */
const usePromptRequestSaveProfile = () => {
  const { t } = useTranslation('broadcastTx');
  const saveProfile = useSaveProfile();
  const returnToCurrentScreen = useReturnToCurrentScreen();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    async (profile?: DesmosProfile): Promise<Result<void, CanceledOperationError>> => {
      const confirmProfileCreation = await new Promise<Result<void, CanceledOperationError>>(
        resolve => {
          navigation.navigate(ROUTES.CONFIRM_MODAL, {
            title: t('save created profile'),
            subtitle: t('save created profile body'),
            onPressPrimary: () => {
              resolve(ok(undefined));
            },
            primaryButtonLabel: 'Save profile',
            secondaryButtonLabel: 'Cancel',
            onPressSecondary: () => {
              resolve(err(new CanceledOperationError()));
              navigation.goBack();
            },
          });
        },
      );

      if (confirmProfileCreation.isErr()) {
        return err(confirmProfileCreation.error);
      }

      return new Promise(resolve => {
        saveProfile({
          profile,
          storeOnChain: true,
          onSuccess: () => {
            returnToCurrentScreen();
            resolve(ok(undefined));
          },
          onCancel: () => {
            resolve(err(new CanceledOperationError()));
          },
        });
      });
    },
    [navigation, returnToCurrentScreen, saveProfile, t],
  );
};

export default usePromptRequestSaveProfile;
