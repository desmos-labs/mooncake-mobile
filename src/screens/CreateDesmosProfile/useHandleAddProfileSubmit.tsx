import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import createLocalWalletState from '@recoil/createLocalWalletState';
import walletAndAccountToAddState from '@recoil/walletAndAccountToAddState';
import {errorImage} from 'assets/images';
import LocalWallet from 'lib/LocalWallet';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dispatch, SetStateAction, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import UploadMedia from 'services/axios/requests/UploadMedia';
import getMessage from './getMessage';

function useHandleAddProfileSubmit(
  initialFormState: {nickname: string; dTag: string; bio: string},
  setLoading: Dispatch<SetStateAction<boolean>>,
  profilePicture: Asset | undefined,
  coverPicture: Asset | undefined,
) {
  const {navigate, pop} =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation('createProfile');
  const walletAndAccountToAdd = useRecoilValue(walletAndAccountToAddState);
  const resetCreateLocalWalletAtom = useResetRecoilState(
    createLocalWalletState,
  );

  const successAction = async () => {
    if (walletAndAccountToAdd.accountWithWalletData) {
      try {
        const deserializedWallet = await LocalWallet.deserialize(
          walletAndAccountToAdd.accountWithWalletData.wallet!,
        );

        await saveLocalWallet(
          deserializedWallet,
          walletAndAccountToAdd.password!,
        );
        await saveMnemonic(
          deserializedWallet.bech32Address,
          walletAndAccountToAdd.mnemonic!,
          walletAndAccountToAdd.password!,
        );
        await saveNewAccount(
          walletAndAccountToAdd.accountWithWalletData.chainAccount,
        );
        resetCreateLocalWalletAtom();
      } catch (e) {
        console.error(e);
      }
    }

    navigate(ROUTES.SETTINGS_PROFILES);
  };

  return useCallback(
    async (formValues: typeof initialFormState) => {
      setLoading(true);

      const {dTag, nickname, bio} = formValues;

      try {
        const [uploadProfilePicResult, uploadCoverPicResult] =
          await Promise.all([
            profilePicture && UploadMedia({mediaFile: profilePicture}),
            coverPicture && UploadMedia({mediaFile: coverPicture}),
          ]);

        const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
        const coverPictureUrl = _.get(uploadCoverPicResult, 'url');

        const deserializedWallet = await LocalWallet.deserialize(
          walletAndAccountToAdd.accountWithWalletData.wallet!,
        );

        const msgs = getMessage(
          deserializedWallet.bech32Address,
          dTag,
          nickname,
          bio,
          profilePictureUrl,
          coverPictureUrl,
        );

        navigate(ROUTES.BROADCAST_TX, {
          messages: msgs,
          offlineSigner: deserializedWallet,
          successAction: () =>
            navigate(ROUTES.RESULT_MODAL, {
              onPressPrimary: () => successAction(),
              title: t('common:success'),
              subtitle: t('created'),
              primaryButtonLabel: t('go to profiles') as string,
              onDismiss: () => null,
            }),
          failureAction: () =>
            navigate(ROUTES.CONFIRM_MODAL, {
              title: t('common:failed'),
              subtitle: t('out of gas'),
              primaryButtonLabel: t('common:retry')!,
              image: errorImage,
              onPressPrimary: () => pop(2),
              secondaryButtonLabel: t('common:go to profiles')!,
              secondaryButtonMode: 'text',
              onPressSecondary: () => navigate(ROUTES.SETTINGS_PROFILES),
              onDismiss: () => pop(2),
            }),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [profilePicture, coverPicture],
  );
}

export default useHandleAddProfileSubmit;
