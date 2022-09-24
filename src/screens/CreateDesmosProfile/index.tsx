import {toBase64} from '@cosmjs/encoding';
import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {StackScreenProps} from '@react-navigation/stack';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {profileParamsState} from '@recoil/profileParams';
import {
  backButton,
  cameraButton,
  createProfileBanner,
  defaultProfilePic,
} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import TextCounter from 'components/TextCounter';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {GenericMsgEnums} from 'lib/desmos/msgtypes';
import LocalWallet, {DEFAULT_WALLET_OPTIONS} from 'lib/LocalWallet';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import CreateAvatar from 'screens/CreateDesmosProfile/components/CreateAvatar';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {ChainAccount, ChainAccountType} from 'types/chains';
import * as Yup from 'yup';
import {AccountData} from '@cosmjs/proto-signing';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_DESMOS_PROFILE
>;

export type CreateDesmosProfileParams = {
  accountOverride?: AccountData;
};

const initialFormState = {
  nickname: '',
  dTag: '',
  bio: '',
};

const CreateDesmosProfile: FC<NavProps> = ({route, navigation}) => {
  const {accountOverride} = route?.params ?? {};
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('createProfile');
  const {goBack, navigate, reset, push} = navigation;

  const {imageAsset: coverPicture, imageFromLibrary: selectCoverPicture} =
    useImageFromDevice({});

  const {imageAsset: profilePicture, imageFromLibrary: selectProfilePicture} =
    useImageFromDevice({});

  const [loading, setLoading] = React.useState(false);

  const profileParams = useRecoilValue(profileParamsState);
  const accountCreation = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);
  const unlockWallet = useUnlockWallet();
  const nicknameInputRef = React.useRef<any>();
  const dTagInputRef = React.useRef<any>();
  const bioInputRef = React.useRef<any>();
  const scrollViewRef = useRef<ScrollView>(null);

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

      const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
        profilePicture && UploadMedia({mediaFile: profilePicture}),
        coverPicture && UploadMedia({mediaFile: coverPicture}),
      ]);

      const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
      const coverPictureUrl = _.get(uploadCoverPicResult, 'url');

      // delay setLoading false so it occurs while the screen is in background
      setTimeout(() => {
        setLoading(false);
      }, 500);

      if (accountCreation && accountCreation.mnemonic) {
        const {password, mnemonic} = accountCreation;
        const wallet = await LocalWallet.fromMnemonic(mnemonic);
        const [address, pubKey] = accountOverride?.address
          ? [accountOverride.address, toBase64(accountOverride.pubkey)]
          : [wallet.bech32Address, toBase64(wallet.publicKey)];
        const messages = getMessage(
          address,
          dTag,
          nickname,
          bio,
          profilePictureUrl,
          coverPictureUrl,
        );

        navigate(ROUTES.BROADCAST_TX, {
          messages,
          offlineSigner: wallet!,
          // save newly created account data and navigate to home page
          async successAction() {
            const newAccount: ChainAccount = {
              address,
              pubKey,
              type: ChainAccountType.Local,
              hdPath: DEFAULT_WALLET_OPTIONS.hdPath,
              signAlgorithm: 'secp256k1',
            };

            await saveLocalWallet(wallet, password!);
            await saveNewAccount(newAccount);
            await saveMnemonic(address, mnemonic, password!);
            setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, address);

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
          failureAction() {
            goBack();
          },
        });
      } else if (createLedgerAccount) {
        const {account: ledgerAccount} = createLedgerAccount;

        if (ledgerAccount) {
          const wallet = (await unlockWallet(ledgerAccount))
            ?.wallet as LocalWallet;
          if (wallet) {
            const messages = getMessage(
              accountOverride?.address || wallet!.bech32Address,
              dTag,
              nickname,
              bio,
              profilePictureUrl,
              coverPictureUrl,
            );
            navigate(ROUTES.BROADCAST_TX, {
              messages,
              offlineSigner: wallet!,
              // save newly created account data and navigate to home page
              async successAction() {
                await saveNewAccount(ledgerAccount);

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
              failureAction() {
                goBack();
              },
            });
          }
        }
      }
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          backgroundColor: theme.colors.white,
        }}>
        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({setFieldValue, values, handleSubmit, errors}) => (
            <>
              <View
                style={{paddingTop: 68, paddingHorizontal: theme.spacing.m}}>
                <Typography.H4>{t('header')}</Typography.H4>
                <Typography.Body6 style={styles.descriptionText}>
                  {t('description')}
                </Typography.Body6>
              </View>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.card}>
                <View style={{flex: 1}}>
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
                      style={{
                        opacity: dTagInputRef.current.isFocused() ? 1 : 0,
                      }}>
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
                    multiline={true}
                    scrollEnabled={false}
                    inputStyle={{alignSelf: 'flex-start'}}
                    placeholder={t('addBio')}
                    onChangeText={value => {
                      setFieldValue('bio', value, true);
                    }}
                    error={!!errors.bio}
                    style={{minHeight: 120}}
                  />
                  {bioInputRef.current && (
                    <View
                      style={{
                        opacity: bioInputRef.current.isFocused() ? 1 : 0,
                      }}>
                      <TextCounter
                        maxChar={profileParams.bio.max_length}
                        textToCount={values.bio}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
              <View style={{padding: theme.spacing.m}}>
                <Button
                  color={theme.colors.surfaceBlack}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}>
                  {t('common:confirm')}
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Save new wallet as last selected wallet
// Build save profile message
function getMessage(
  creator: string,
  dTag: string,
  nickname: string,
  bio: string,
  profilePictureUrl: string | undefined,
  coverPictureUrl: string | undefined,
): MsgSaveProfileEncodeObject[] {
  // Save new wallet as last selected wallet
  // Build save profile message
  const saveProfileMessage: MsgSaveProfileEncodeObject = {
    typeUrl: GenericMsgEnums.MsgSaveProfile,
    value: {
      creator,
      dtag: dTag,
      nickname: nickname || '[do-not-modify]',
      bio: bio || '[do-not-modify]',
      profilePicture: profilePictureUrl || '[do-not-modify]',
      coverPicture: coverPictureUrl || '[do-not-modify]',
    },
  };
  return [saveProfileMessage];
}

export default CreateDesmosProfile;
