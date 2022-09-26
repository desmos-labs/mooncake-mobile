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
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import CreateAvatar from 'screens/CreateDesmosProfile/components/CreateAvatar';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {ChainAccount, ChainAccountType} from 'types/chains';
import * as Yup from 'yup';
import {
  selectedExternalAccountState,
  signerState,
} from '@recoil/connectChainState';
import {format} from 'date-fns';
import profilesState from '@recoil/profiles';
import signUpInfoState, {
  signUpBioState,
  signUpCoverPicState,
  signUpNicknameState,
  signUpProfilePicState,
} from '@recoil/signUpInfoState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_DESMOS_PROFILE
>;

const CreateDesmosProfile: FC<NavProps> = ({navigation}) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('createProfile');
  const {goBack, navigate, reset, push, getState} = navigation;

  const signUpInfo = useRecoilValue(signUpInfoState);
  const setCoverPic = useSetRecoilState(signUpCoverPicState);
  const setProfilePic = useSetRecoilState(signUpProfilePicState);
  const setBio = useSetRecoilState(signUpBioState);
  const setNickname = useSetRecoilState(signUpNicknameState);

  const fromSignUp = React.useMemo(() => {
    const {routes} = getState();

    return routes[routes.length - 2].name === ROUTES.SIGNUP;
  }, []);

  const {imageAsset: coverPicture, imageFromLibrary: selectCoverPicture} =
    useImageFromDevice({
      onImageSelected: image => setCoverPic(image),
    });

  const {imageAsset: profilePicture, imageFromLibrary: selectProfilePicture} =
    useImageFromDevice({
      onImageSelected: image => setProfilePic(image),
    });

  const [loading, setLoading] = React.useState(false);

  const profileParams = useRecoilValue(profileParamsState);
  const accountCreation = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);
  const signer = useRecoilValue(signerState);
  const unlockWallet = useUnlockWallet();
  const nicknameInputRef = React.useRef<TextInput>(null);
  const dTagInputRef = React.useRef<TextInput>(null);
  const bioInputRef = React.useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const dtagMinLength = 6; // override the value (3) from query, 6 for App
  const nicknameMaxLength = 30; // override the value (1000) from query, 30 for App

  const validationSchema = React.useMemo(() => {
    if (fromSignUp) {
      return Yup.object().shape({
        nickname: Yup.string()
          .min(profileParams.nickname.min_length)
          .max(nicknameMaxLength),
        bio: Yup.string().max(
          parseInt(profileParams.bio.max_length, 10),
          t('error:maxLength', {
            numChars: profileParams.bio.max_length,
          }),
        ),
      });
    }
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.min_length)
        .max(nicknameMaxLength),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(dtagMinLength)
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

  const selectedExternalAccount = useRecoilValue(selectedExternalAccountState);
  const setLoadedProfiles = useSetRecoilState(profilesState);

  const initialFormState = React.useMemo(() => {
    if (fromSignUp) {
      return {
        nickname: signUpInfo.nickname,
        dTag: signUpInfo.dTag,
        bio: signUpInfo.bio,
      };
    }

    return {
      nickname: '',
      dTag: '',
      bio: '',
    };
  }, []);

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

      const failureAction = goBack;
      const useExternalAccount =
        accountCreation?.useExternalAccount ??
        createLedgerAccount?.useExternalAccount;

      if (useExternalAccount) {
        /**
         * Profile
         * Since a Profile extends the Cosmos SDK AccountI interface, we store profiles inside the x/auth module using the AccountKeeper.
         * For this reason, there will only be a single profile for each on-chain account and having multiple profiles require to have different on-chain accounts for each one.
         * In order to make it possible for users to search a profile based on the DTag, we also store the following reference:
         * DTag: 0x10 | DTag | -> Address
         * https://github.com/desmos-labs/desmos/blob/95711e2da7a83479d01be213f29f30df9a964b86/x/profiles/spec/03-state.md#profile
         */
        try {
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
          // TO DO: Query failed with (22): rpc error: code = NotFound desc = account desmos1ulg2sp2clwkxwdh9vsn2r5rwdmx0g7w4ksp5yc not found: key not found
          navigate(ROUTES.BROADCAST_TX, {
            messages,
            offlineSigner: signer,
            async successAction() {
              const newProfile: ProfileData = {
                address: messages[0].value.creator,
                bio: messages[0].value.bio,
                cover_pic: messages[0].value.coverPicture,
                dtag: messages[0].value.dtag,
                profile_pic: messages[0].value.profilePicture,
                nickname: messages[0].value.nickname,
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

              push(ROUTES.FULLSCREEN_STATUS_SCREEN, {
                title: t('resultModal:success'),
                subtitle: t('common:desmosProfileCreated'),
                buttonLabel: t('common:goToProfile'),
                handleButtonPress: () => {
                  navigate(ROUTES.USER_PROFILE, {
                    visitingProfileAddress: address,
                  });
                },
              });
            },
            failureAction,
          });
        } catch (error) {
          const errorMessage = ((err): err is Error =>
            !!(err as Error).message)(error)
            ? error.message
            : String(error);
          push(ROUTES.FULLSCREEN_STATUS_SCREEN, {
            title: t('resultModal:fail'),
            subtitle: errorMessage,
            buttonLabel: t('common:retry'),
            handleButtonPress: goBack,
            secondaryButtonLabel: t('common:goToProfile'),
            handleSecondaryButtonPress: () => {
              navigate(ROUTES.USER_PROFILE);
            },
          });
        } finally {
          setLoading(false);
        }
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

        navigate(ROUTES.BROADCAST_TX, {
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
      }
    },
    [
      accountCreation,
      createLedgerAccount,
      signer,
      profilePicture,
      coverPicture,
      setLoadedProfiles,
    ],
  );

  const inlineStyles: {[key: string]: ViewStyle | TextStyle} = {
    kbView: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.white,
    },
    header: {paddingTop: 68, paddingHorizontal: theme.spacing.m},
    scrollContainer: {flex: 1},
    nickname: {opacity: nicknameInputRef.current?.isFocused() ? 1 : 0},
    dTag: {opacity: dTagInputRef.current?.isFocused() ? 1 : 0},
    bioInput: {alignSelf: 'flex-start'},
    bio: {opacity: bioInputRef.current?.isFocused() ? 1 : 0},
    bioDTextInput: {minHeight: 120},
    errorText: {color: theme.colors.pink01, flex: 1},
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {fromSignUp ? (
        <Image
          source={
            signUpInfo.coverPicture
              ? {uri: signUpInfo.coverPicture.uri}
              : createProfileBanner
          }
          style={styles.bannerImage}
        />
      ) : (
        <Image
          source={coverPicture ? {uri: coverPicture.uri} : createProfileBanner}
          style={styles.bannerImage}
        />
      )}

      <View style={styles.headerButtonGroup}>
        <ProfileHeaderButton imageSrc={backButton} onPress={goBack} />

        <ProfileHeaderButton
          imageSrc={cameraButton}
          style={styles.cameraButton}
          onPress={selectCoverPicture}
        />
      </View>

      {fromSignUp ? (
        <CreateAvatar
          avatar={
            signUpInfo.profilePicture
              ? {uri: signUpInfo.profilePicture.uri}
              : defaultProfilePic
          }
          handlePressEdit={selectProfilePicture}
        />
      ) : (
        <CreateAvatar
          avatar={
            profilePicture ? {uri: profilePicture.uri} : defaultProfilePic
          }
          handlePressEdit={selectProfilePicture}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={inlineStyles.kbView}>
        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({setFieldValue, values, handleSubmit, errors}) => (
            <>
              <View style={inlineStyles.header}>
                <Typography.H4>{t('header')}</Typography.H4>
                <Typography.Body6 style={styles.descriptionText}>
                  {t('description')}
                </Typography.Body6>
              </View>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.card}>
                <View style={inlineStyles.scrollContainer}>
                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('nickname')}
                  </Typography.Subtitle2>
                  <DTextInput
                    inputRef={nicknameInputRef}
                    value={values.nickname}
                    placeholder={t('enterNickname')}
                    onChangeText={value => {
                      setFieldValue('nickname', value, true);
                      fromSignUp && setNickname(value);
                    }}
                    error={!!errors.nickname}
                  />
                  {errors.nickname && (
                    <Typography.Caption1 style={inlineStyles.errorText}>
                      {errors.nickname}
                    </Typography.Caption1>
                  )}
                  {nicknameInputRef.current && (
                    <View style={inlineStyles.nickname}>
                      <TextCounter
                        maxChar={nicknameMaxLength}
                        textToCount={values.nickname}
                      />
                    </View>
                  )}

                  {!fromSignUp && (
                    <>
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
                        autoCapitalize="none"
                      />
                    </>
                  )}
                  {errors.dTag && (
                    <Typography.Caption1 style={inlineStyles.errorText}>
                      {errors.dTag}
                    </Typography.Caption1>
                  )}
                  {dTagInputRef.current && (
                    <View style={inlineStyles.dTag}>
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
                    inputStyle={inlineStyles.bioInput}
                    placeholder={t('addBio')}
                    onChangeText={value => {
                      setFieldValue('bio', value, true);
                      fromSignUp && setBio(value);
                    }}
                    error={!!errors.bio}
                    style={inlineStyles.bioDTextInput}
                  />
                  {errors.bio && (
                    <Typography.Caption1 style={inlineStyles.errorText}>
                      {errors.bio}
                    </Typography.Caption1>
                  )}
                  {bioInputRef.current && (
                    <View style={inlineStyles.bio}>
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
                  onPress={fromSignUp ? goBack : handleSubmit}
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
