import {StackNavigationProp} from '@react-navigation/stack';
import LocalWallet from 'lib/LocalWallet';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dispatch, SetStateAction, useCallback} from 'react';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import {UnwrapRecoilValue, useRecoilValue, useSetRecoilState} from 'recoil';
import profilesState from '@recoil/profiles';
import {useNavigation} from '@react-navigation/native';
import createLocalWalletState from '@recoil/createLocalWalletState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import {selectedExternalAccountState} from '@recoil/connectChainState';
import getMessage from './getMessage';
import useResetAfterRoute from './useResetAfterRoute';
import useRetryableBroadcast from './useRetryableBroadcast';

function useHandleAddProfileSubmit(
  initialFormState: {nickname: string; dTag: string; bio: string},
  setLoading: Dispatch<SetStateAction<boolean>>,
  profilePicture: Asset | undefined,
  coverPicture: Asset | undefined,
  accountCreation: UnwrapRecoilValue<typeof createLocalWalletState>,
  createLedgerAccount: UnwrapRecoilValue<typeof createLedgerAccountState>,
) {
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation('createProfile');
  const resetAfterRoute = useResetAfterRoute();
  const {broadcastActionRef, failureAction} = useRetryableBroadcast();
  const setLoadedProfiles = useSetRecoilState(profilesState);
  const selectedExternalAccount = useRecoilValue(selectedExternalAccountState);

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
          selectedExternalAccount,
        );
        const address = externalWallet.bech32Address;
        const messages = getMessage(
          address,
          dTag,
          nickname,
          bio,
          profilePictureUrl,
          coverPictureUrl,
        );
        broadcastActionRef.current = pushOrReplace => {
          pushOrReplace(ROUTES.BROADCAST_TX, {
            messages,
            offlineSigner: externalWallet,
            async successAction() {
              const newProfile: ProfileData = {
                address,
                bio,
                cover_pic: coverPictureUrl ?? '',
                dtag: dTag,
                profile_pic: profilePictureUrl ?? '',
                nickname,
                followage: [],
                following: [],
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
                    navigation.navigate(ROUTES.ADD_PROFILE);
                  },
                },
              });
            },
            failureAction,
          });
        };
        broadcastActionRef.current(navigation.push);
      } catch (error) {
        const errorMessage = ((err): err is Error => !!(err as Error).message)(
          error,
        )
          ? error.message
          : String(error);
        failureAction(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      accountCreation,
      createLedgerAccount,
      profilePicture,
      coverPicture,
      navigation,
    ],
  );
}

export default useHandleAddProfileSubmit;
