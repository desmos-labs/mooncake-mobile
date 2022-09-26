import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import LocalWallet, {randomMnemonic} from 'lib/LocalWallet';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {GenericMsgEnums} from 'lib/desmos/msgtypes';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {DesmosHdPath} from 'types/hdpath';
import {toBase64} from '@cosmjs/encoding';
import {useRecoilValue} from 'recoil';
import signUpInfoState from '@recoil/signUpInfoState';
import UploadMedia from 'services/axios/requests/UploadMedia';
import _ from 'lodash';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const useHooks = () => {
  const {navigate, reset, goBack, push} =
    useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('passwordManipulation');

  const signUpInfo = useRecoilValue(signUpInfoState);

  const [loading, setLoading] = React.useState(false);

  const initialFormValues = {
    dTag: '',
    newPassword: '',
    confirmPassword: '',
    consent: false,
  };

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      setLoading(true);
      // First time user, create new wallet
      const mnemonic = randomMnemonic();

      const {confirmPassword, dTag} = formValues;
      const newWallet = await LocalWallet.fromMnemonic(mnemonic, {
        // TODO: dev only, remove before pushing
        // hdPath: {coinType: 852, account: 1, change: 0, addressIndex: 0},
      });
      const address = newWallet.bech32Address;

      const account: ChainAccount = {
        type: ChainAccountType.Local,
        address: newWallet.bech32Address,
        hdPath: {
          ...DesmosHdPath,
        },
        pubKey: toBase64(newWallet.publicKey),
        signAlgorithm: 'secp256k1',
      };

      await saveNewAccount(account);
      await saveLocalWallet(newWallet, confirmPassword);
      await saveMnemonic(newWallet.bech32Address, confirmPassword, mnemonic);
      setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, address);

      const {nickname, coverPicture, profilePicture, bio} = signUpInfo;

      const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
        profilePicture && UploadMedia({mediaFile: profilePicture}),
        coverPicture && UploadMedia({mediaFile: coverPicture}),
      ]);

      const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
      const coverPictureUrl = _.get(uploadCoverPicResult, 'url');

      // Save new wallet as last selected wallet
      // Build save profile message
      const saveProfileMessage: MsgSaveProfileEncodeObject = {
        typeUrl: GenericMsgEnums.MsgSaveProfile,
        value: {
          creator: address,
          dtag: dTag,
          nickname: nickname || '[do-not-modify]',
          bio: bio || '[do-not-modify]',
          profilePicture: profilePictureUrl || '[do-not-modify]',
          coverPicture: coverPictureUrl || '[do-not-modify]',
        },
      };

      const messages = [saveProfileMessage];

      setLoading(false);

      navigate(ROUTES.BROADCAST_TX, {
        messages,
        offlineSigner: newWallet,
        successAction: () => {
          push(ROUTES.FULLSCREEN_STATUS_SCREEN, {
            title: t('common:congratulations'),
            subtitle: t('common:dtag created'),
            buttonLabel: t('resultModal:enterApp'),
            handleButtonPress: () => {
              reset({
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
          goBack();
        },
      });
    },
    [signUpInfo],
  );

  const openInfoModal = useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, []);

  const validateForm = useCallback((values: typeof initialFormValues) => {
    const errors: any = {};

    if (!values.consent) {
      errors.consent = t('consent not checked');
    }

    return errors;
  }, []);

  const handlePressPP = useCallback(() => {
    // go to Privacy policy page
  }, []);

  const handlePressTOS = useCallback(() => {
    // go to Terms of Service page
  }, []);

  return {
    handlePressPP,
    handlePressTOS,
    handleFormSubmit,
    openInfoModal,
    validateForm,
    initialFormValues,
    loading,
  };
};

export default useHooks;
