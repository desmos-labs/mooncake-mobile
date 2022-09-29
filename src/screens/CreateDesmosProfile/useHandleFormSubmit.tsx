import {toBase64} from '@cosmjs/encoding';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {StackNavigationProp} from '@react-navigation/stack';
import {GenericMsgEnums} from 'lib/desmos/msgtypes';
import LocalWallet, {DEFAULT_WALLET_OPTIONS} from 'lib/LocalWallet';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dispatch, SetStateAction, useCallback} from 'react';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import profilesState from '@recoil/profiles';
import {useNavigation} from '@react-navigation/native';
import createLocalWalletState from '@recoil/createLocalWalletState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import {selectedExternalAccountState} from '@recoil/connectChainState';
import getMessage from './getMessage';
import useResetAfterRoute from './NavigationRoute';
import useRetryableBroadcast from './useRetryableBroadcast';

function useHandleFormSubmit(
  initialFormState: {nickname: string; dTag: string; bio: string},
  setLoading: Dispatch<SetStateAction<boolean>>,
  profilePicture: Asset | undefined,
  coverPicture: Asset | undefined,
) {
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation('createProfile');
  const unlockWallet = useUnlockWallet();
  const resetAfterRoute = useResetAfterRoute();
  const {broadcastActionRef, failureAction} = useRetryableBroadcast();
  const setLoadedProfiles = useSetRecoilState(profilesState);
  const accountCreation = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);
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
        const useExternalAccount =
          accountCreation?.useExternalAccount ??
          createLedgerAccount?.useExternalAccount;

        if (useExternalAccount) {
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

                resetAfterRoute(ROUTES.SETTINGS_PROFILES, {
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
          };
          broadcastActionRef.current(navigation.push);
        } else {
          let wallet: LocalWallet;
          if (accountCreation && accountCreation.mnemonic) {
            const {mnemonic} = accountCreation;
            wallet = await LocalWallet.fromMnemonic(mnemonic);
          } else if (createLedgerAccount && createLedgerAccount.account) {
            const {account: ledgerAccount} = createLedgerAccount;
            wallet = (await unlockWallet(ledgerAccount))!.wallet as LocalWallet;
          }

          // Save new wallet as last selected wallet
          // Build save profile message
          const saveProfileMessage: MsgSaveProfileEncodeObject = {
            typeUrl: GenericMsgEnums.MsgSaveProfile,
            value: {
              creator: wallet!.bech32Address,
              dtag: dTag,
              nickname: nickname || '[do-not-modify]',
              bio: bio || '[do-not-modify]',
              profilePicture: profilePictureUrl || '[do-not-modify]',
              coverPicture: coverPictureUrl || '[do-not-modify]',
            },
          };

          const messages = [saveProfileMessage];

          // delay setLoading false so it occurs while the screen is in background
          setTimeout(() => {
            setLoading(false);
          }, 500);

          navigation.navigate(ROUTES.BROADCAST_TX, {
            messages,
            offlineSigner: wallet!,
            // save newly created account data and navigate to home page
            successAction: async () => {
              if (accountCreation && accountCreation.mnemonic) {
                const {password, mnemonic} = accountCreation;
                // wallet = await LocalWallet.fromMnemonic(mnemonic);
                const newAccount: ChainAccount = {
                  address: wallet.bech32Address,
                  pubKey: toBase64(wallet.publicKey),
                  type: ChainAccountType.Local,
                  hdPath: DEFAULT_WALLET_OPTIONS.hdPath,
                  signAlgorithm: 'secp256k1',
                };

                await saveLocalWallet(wallet, password!);
                await saveNewAccount(newAccount);
                await saveMnemonic(wallet.bech32Address, mnemonic, password!);
                setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, wallet.bech32Address);
              } else if (createLedgerAccount && createLedgerAccount.account) {
                const {account: ledgerAccount} = createLedgerAccount;

                // wallet = (await unlockWallet(ledgerAccount))!
                //   .wallet as LocalWallet;
                await saveNewAccount(ledgerAccount);
              }

              navigation.replace(ROUTES.FULLSCREEN_STATUS_SCREEN, {
                title: t('common:congratulations'),
                subtitle: t('common:dtag created'),
                buttonLabel: t('resultModal:enterApp'),
                handleButtonPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: ROUTES.HOME,
                      },
                    ],
                  });
                },
              });
            },
            failureAction: () => {
              navigation.goBack();
            },
          });
        }
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

export default useHandleFormSubmit;
