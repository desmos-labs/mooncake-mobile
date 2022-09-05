import React from 'react';
import DView from 'components/DView';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {
  backButton,
  cameraButton,
  createProfileBanner,
  defaultProfilePic,
} from 'assets/images';
import Typography from 'components/Typography';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import CreateAvatar from 'screens/CreateDesmosProfile/components/CreateAvatar';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {useRecoilValue} from 'recoil';
import {profileParamsState} from '@recoil/profileParams';
import * as Yup from 'yup';
import DTextInput from 'components/DTextInput';
import TextCounter from 'components/TextCounter';
import Button from 'components/Button';
import {useTheme} from 'react-native-paper';
import useImageFromDevice from 'hooks/useImageFromDevice';
import createLocalWalletState from '@recoil/createLocalWalletState';
import LocalWallet, {DEFAULT_WALLET_OPTIONS} from 'lib/LocalWallet';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {toBase64} from '@cosmjs/encoding';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import MsgTypes from 'lib/desmos/msgtypes';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import useUnlockWallet from 'hooks/useUnlockWallet';
import UploadMedia from 'services/axios/requests/UploadMedia';
import _ from 'lodash';
import useStyles from './useStyles';

type NavProp = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_DESMOS_PROFILE
>;

const initialFormState = {
  nickname: '',
  dTag: '',
  bio: '',
};

const CreateDesmosProfile = () => {
  const styles = useStyles();

  const theme = useTheme();

  const {t} = useTranslation('createProfile');

  const {goBack, navigate, reset, push} =
    useNavigation<NavProp['navigation']>();

  const {imageAsset: coverPicture, imageFromLibrary: selectCoverPicture} =
    useImageFromDevice();

  const {imageAsset: profilePicture, imageFromLibrary: selectProfilePicture} =
    useImageFromDevice();

  const [loading, setLoading] = React.useState(false);

  const profileParams = useRecoilValue(profileParamsState);
  const accountCreation = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);
  const unlockWallet = useUnlockWallet();

  const nicknameInputRef = React.useRef<any>();
  const dTagInputRef = React.useRef<any>();
  const bioInputRef = React.useRef<any>();

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.min_length)
        .max(profileParams.nickname.max_length),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(profileParams.dtag.min_length)
        .max(profileParams.dtag.max_length)
        .test(
          'respect reg_ex',
          t('Only _ is allowed as special character'),
          value => {
            return new RegExp(profileParams.dtag.reg_ex, 'g').test(
              value as string,
            );
          },
        ),
      bio: Yup.string().max(
        parseInt(profileParams.bio.max_length, 10),
        t('error:maxLength', {
          numChars: profileParams.bio.max_length,
        }),
      ),
    });
  }, [profileParams]);

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormState) => {
      setLoading(true);

      const {dTag, nickname, bio} = formValues;

      let wallet: LocalWallet;

      const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
        profilePicture && UploadMedia({mediaFile: profilePicture}),
        coverPicture && UploadMedia({mediaFile: coverPicture}),
      ]);

      const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
      const coverPictureUrl = _.get(uploadCoverPicResult, 'url');

      // Save new wallet as last selected wallet
      // Build save profile message
      const saveProfileMessage: MsgSaveProfileEncodeObject = {
        typeUrl: MsgTypes.MsgSaveProfile,
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

      navigate(ROUTES.BROADCAST_TX, {
        messages,
        offlineSigner: wallet!,
        // save newly created account data and navigate to home page
        successAction: async () => {
          if (accountCreation && accountCreation.mnemonic) {
            const {password, mnemonic} = accountCreation;
            wallet = await LocalWallet.fromMnemonic(mnemonic);

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

            wallet = (await unlockWallet(ledgerAccount))!.wallet as LocalWallet;
            await saveNewAccount(ledgerAccount);
          }

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
    [],
  );

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white}>
      <Image
        source={coverPicture ? {uri: coverPicture.uri} : createProfileBanner}
        style={styles.bannerImage}
      />

      <View style={styles.headerButtonGroup}>
        <ProfileHeaderButton imageSrc={backButton} onPress={goBack} />

        <ProfileHeaderButton
          imageSrc={cameraButton}
          style={styles.cameraButton}
          onPress={selectCoverPicture}
        />
      </View>

      <CreateAvatar
        avatar={profilePicture ? {uri: profilePicture.uri} : defaultProfilePic}
        handlePressEdit={selectProfilePicture}
      />
      <ScrollView style={styles.scrollview} contentContainerStyle={styles.card}>
        <Typography.H4>{t('header')}</Typography.H4>
        <Typography.Body6 style={styles.descriptionText}>
          {t('description')}
        </Typography.Body6>

        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({setFieldValue, values, handleSubmit, errors}) => (
            <>
              <Typography.Subtitle2 style={styles.inputLabel}>
                {t('nickname')}
              </Typography.Subtitle2>
              <DTextInput
                inputRef={nicknameInputRef}
                value={values.nickname}
                placeholder={t('enterNickname')}
                onChangeText={value => {
                  setFieldValue('nickname', value, true);
                }}
                error={!!errors.nickname}
              />
              {nicknameInputRef.current && (
                <View
                  style={{
                    opacity: nicknameInputRef.current.isFocused() ? 1 : 0,
                  }}>
                  <TextCounter
                    maxChar={profileParams.nickname.max_length}
                    textToCount={values.nickname}
                  />
                </View>
              )}

              <Typography.Subtitle2 style={styles.inputLabel}>
                {t('dTag')}
              </Typography.Subtitle2>
              <DTextInput
                value={values.dTag}
                placeholder={t('enterDTag')}
                onChangeText={value => {
                  setFieldValue('dTag', value, true);
                }}
                error={!!errors.dTag}
                inputRef={dTagInputRef}
              />
              {dTagInputRef.current && (
                <View
                  style={{opacity: dTagInputRef.current.isFocused() ? 1 : 0}}>
                  <TextCounter
                    maxChar={profileParams.dtag.max_length}
                    textToCount={values.dTag}
                  />
                </View>
              )}

              <Typography.Subtitle2 style={styles.inputLabel}>
                {t('bio')}
              </Typography.Subtitle2>
              <DTextInput
                inputRef={bioInputRef}
                value={values.bio}
                placeholder={t('addBio')}
                onChangeText={value => {
                  setFieldValue('bio', value, true);
                }}
                error={!!errors.bio}
                multiline
                style={{
                  height: 120,
                }}
              />
              {bioInputRef.current && (
                <View
                  style={{opacity: bioInputRef.current.isFocused() ? 1 : 0}}>
                  <TextCounter
                    maxChar={profileParams.bio.max_length}
                    textToCount={values.bio}
                  />
                </View>
              )}

              <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 200}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <Button
                  mode="gradientFilled"
                  onPress={handleSubmit}
                  loading={loading}>
                  {t('common:confirm')}
                </Button>
              </KeyboardAvoidingView>
            </>
          )}
        </Formik>
      </ScrollView>
    </DView>
  );
};

export default CreateDesmosProfile;
