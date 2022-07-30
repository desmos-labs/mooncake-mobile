import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import LocalWallet, {randomMnemonic} from 'lib/LocalWallet';
import {setItem} from 'lib/SecureStorage';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import MsgTypes from 'lib/desmos/msgtypes';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const useHooks = () => {
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('passwordManipulation');

  const initialFormValues = {
    dTag: '',
    newPassword: '',
    confirmPassword: '',
    consent: false,
  };

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      console.log(formValues);

      // First time user, create new wallet

      const mnemonic = randomMnemonic();

      const {confirmPassword, dTag} = formValues;
      const newWallet = await LocalWallet.fromMnemonic(mnemonic, {
        // TODO: dev only, remove before pushing
        hdPath: {coinType: 852, account: 1, change: 0, addressIndex: 0},
      });
      const address = newWallet.bech32Address;

      // save mnemonic and wallet to local storage
      // mnemonic is saved for future "back up" feature
      await Promise.all([
        setItem(`${address}_key`, newWallet.serialize(), {
          password: confirmPassword,
        }),
        setItem(`${address}_mnemonic`, mnemonic, {password: confirmPassword}),
      ]);

      // Save new wallet as last selected wallet
      setMMKV(MMKVKEYS.ACTIVE_WALLET_ADDR, address);
      // Build save profile message
      const saveProfileMessage: MsgSaveProfileEncodeObject = {
        typeUrl: MsgTypes.MsgSaveProfile,
        value: {
          creator: address,
          dtag: dTag,
          nickname: '[do-not-modify]',
          bio: '[do-not-modify]',
          profilePicture: '[do-not-modify]',
          coverPicture: '[do-not-modify]',
        },
      };

      const messages = [saveProfileMessage];

      navigate(ROUTES.BROADCAST_TX, {
        messages,
        serializedWallet: newWallet.serialize(),
      });
    },
    [],
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
  };
};

export default useHooks;
