import {toBase64} from '@cosmjs/encoding';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {GenericMsgEnums} from 'lib/desmos/msgtypes';
import LocalWallet, {DEFAULT_WALLET_OPTIONS} from 'lib/LocalWallet';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dispatch, SetStateAction, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import {UnwrapRecoilValue} from 'recoil';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {ChainAccount, ChainAccountType} from 'types/chains';
import useActiveAccount from 'hooks/useActiveAccount';

function useHandleFormSubmit(
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
  const unlockWallet = useUnlockWallet();
  const {setActiveAddress} = useActiveAccount();

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

        let wallet: LocalWallet;
        if (accountCreation && accountCreation.mnemonic) {
          const {mnemonic} = accountCreation;
          wallet = await LocalWallet.fromMnemonic(mnemonic);
        } else if (createLedgerAccount && createLedgerAccount.account) {
          const {account: ledgerAccount} = createLedgerAccount;
          wallet = (await unlockWallet({chainAccount: ledgerAccount}))!
            .wallet as LocalWallet;
        }

        // Save new wallet as last selected wallet
        // Build save profile message
        const saveProfileMessage: MsgSaveProfileEncodeObject = {
          typeUrl: GenericMsgEnums.MsgSaveProfile,
          value: {
            creator:
              wallet!.bech32Address || createLedgerAccount.account!.address,
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
          title: t('broadcastTx:createProfile') as string,
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
              setActiveAddress(wallet.bech32Address);
              // setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, wallet.bech32Address);
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
                      name: ROUTES.HOME_TABS,
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
