import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {selectedExternalAccountState} from '@recoil/connectChainState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {errorImage} from 'assets/images';
import LocalWallet from 'lib/LocalWallet';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dispatch, SetStateAction, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import {UnwrapRecoilValue, useRecoilValue, useResetRecoilState} from 'recoil';
import UploadMedia from 'services/axios/requests/UploadMedia';
import getMessage from './getMessage';

function useHandleAddProfileSubmit(
  initialFormState: {nickname: string; dTag: string; bio: string},
  setLoading: Dispatch<SetStateAction<boolean>>,
  profilePicture: Asset | undefined,
  coverPicture: Asset | undefined,
  accountCreation: UnwrapRecoilValue<typeof createLocalWalletState>,
  createLedgerAccount: UnwrapRecoilValue<typeof createLedgerAccountState>,
) {
  const {navigate, pop} =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation('createProfile');
  const selectedExternalAccount = useRecoilValue(selectedExternalAccountState);
  const resetCreateLocalWalletAtom = useResetRecoilState(
    createLocalWalletState,
  );

  const successAction = (address: string) => {
    console.log('success click');
    console.log(address);
    resetCreateLocalWalletAtom();
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

        if (!accountCreation && !createLedgerAccount) {
          throw new Error('No account creation data');
        }
        const externalWallet = await LocalWallet.deserialize(
          selectedExternalAccount.signer as string,
        );
        console.log('wallet', externalWallet);
        console.log('account creation', accountCreation);

        const msgs = getMessage(
          externalWallet.bech32Address,
          dTag,
          nickname,
          bio,
          profilePictureUrl,
          coverPictureUrl,
        );

        navigate(ROUTES.BROADCAST_TX, {
          messages: msgs,
          offlineSigner: externalWallet,
          successAction: () =>
            navigate(ROUTES.RESULT_MODAL, {
              onPressPrimary: () => successAction(externalWallet.bech32Address),
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

        /*        const messages = getMessage(
          address,
          dTag,
          nickname,
          bio,
          profilePictureUrl,
          coverPictureUrl,
        ); */
        /*            async successAction() {
              const newProfile: ProfileData = {
                address,
                bio,
                cover_pic: coverPictureUrl ?? '',
                dtag: dTag,
                profile_pic: profilePictureUrl ?? '',
                nickname,
                followage: [],
                following: [],
                transactions: [],
                creation_time: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // TO DO: get creation time
              };
              setLoadedProfiles(prev => {
                const prevWithExternal = prev.filter(
                  profile => profile.address !== externalWallet.bech32Address,
                );
                return prevWithExternal.concat([newProfile]);
              });

              resetAfterRoute(ROUTES.ADD_PROFILE, {
                name: ROUTES.FULLSCREEN_STATUS_SCREEN,
                params: {
                  title: t('resultModal:success'),
                  subtitle: t('common:desmosProfileCreated'),
                  buttonLabel: t('common:goToProfile'),
                  handleButtonPress() {
                    navigation.replace(ROUTES.USER_PROFILE, {
                      visitingProfileAddress: address,
                    });
                  },
                  handleBackgroundPress() {
                    navigation.navigate(ROUTES.SETTINGS_PROFILES);
                  },
                },
              });
            },
            failureAction,
          });
        }; */
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [accountCreation, createLedgerAccount, profilePicture, coverPicture],
  );
}

export default useHandleAddProfileSubmit;
