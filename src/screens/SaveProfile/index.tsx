import {
  backButton,
  cameraButton,
  defaultBanner,
  defaultProfilePic,
} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import TextCounter from 'components/TextCounter';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {DesmosProfile} from 'types/desmos';
import {AccountWithWallet} from 'types/account';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import useImageFromDevice from 'hooks/useImageFromDevice';
import {Asset} from 'react-native-image-picker';
import useProfileParams from 'hooks/useProfileParams';
import {SaveProfileStatus} from 'hooks/useSaveProfile';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from 'screens/SaveProfile/useStyles';
import CreateAvatar from './components/CreateAvatar';
import {
  SaveProfileFormState,
  useGetImageBackground,
  useInitialFormState,
  useSubmitForm,
  useValidationSchema,
} from './hooks';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SAVE_PROFILE
>;

/**
 * Optional that can be passed when navigating to this screen.
 */
export interface SaveProfileParams {
  /**
   * Optional callback that is used when the profile is saved properly.
   */
  readonly onSuccess?: () => void;
  /**
   * Optional profile that should be edited.
   * If this is not provided, a new profile will be created instead.
   */
  readonly profile?: DesmosProfile;
  /**
   * Optional account that can be used to sign the transaction while saving the profile.
   * If this is not provided, the current account will be used instead.
   */
  readonly account?: AccountWithWallet;
}

/**
 * Screen that allows to either edit a given Desmos profile, or create a new one.
 * @constructor
 */
const SaveProfile = (props: NavProps) => {
  const theme = useTheme();
  const {t} = useTranslation('createProfile');
  const toast = useToast();

  // Screen props
  const {goBack} = useNavigation<NavProps['navigation']>();
  const {route} = props;
  const {params} = route;
  const profile = params?.profile;
  const account = params?.account;
  const onSuccess = params?.onSuccess;

  // Validation params
  const {params: profileParams} = useProfileParams();

  // State of the edit form
  const [profilePic, setProfilePic] = useState<Asset>();
  const profilePicBackground = useGetImageBackground(
    profilePic,
    profile?.profilePicture,
    defaultProfilePic,
  );
  const [coverPic, setCoverPic] = useState<Asset>();
  const coverPictureBackground = useGetImageBackground(
    coverPic,
    profile?.coverPicture,
    defaultBanner,
  );

  // Inputs styles
  const nicknameInputRef = useRef<TextInput>(null);
  const dTagInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = useStyles({nicknameInputRef, dTagInputRef, bioInputRef});

  // Form validation
  const initialFormState = useInitialFormState(profile);
  const validationSchema = useValidationSchema(profileParams);

  // Actions
  const {imageFromLibrary: selectCoverPicture} = useImageFromDevice({
    onImageSelected: image => setCoverPic(image),
  });
  const {imageFromLibrary: selectProfilePicture} = useImageFromDevice({
    onImageSelected: image => setProfilePic(image),
  });

  // Callback used when the profile saving is successful.
  const onSubmitSuccess = useCallback(() => {
    if (onSuccess) {
      onSuccess();
    }
  }, [onSuccess]);

  // Callback used when the profile saving has an error.
  const onSubmitError = useCallback(
    (error: Error) => {
      toast.show(error.message, {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    },
    [toast],
  );

  // Hook to submit the form and check the status of the profile saving.
  const {status, submitForm} = useSubmitForm(
    profile,
    account,
    onSubmitSuccess,
    onSubmitError,
  );

  // Callback used when the user presses the Save button.
  const onEditProfile = useCallback(async (values: SaveProfileFormState) => {
    await submitForm(values, profilePic, coverPic);
  }, []);

  /**
   * Value that tells whether the profile is being saved or not.
   */
  const isLoading = useMemo(
    () =>
      status !== SaveProfileStatus.UNDEFINED &&
      status !== SaveProfileStatus.DONE,
    [status],
  );

  return (
    <DView
      showLoadingOverlay={isLoading}
      style={styles.container}
      backgroundImage={coverPictureBackground}
      backgroundColor={theme.colors.white}>
      <View style={styles.headerButtonGroup}>
        <ProfileHeaderButton
          imageSrc={backButton}
          style={styles.topButton}
          onPress={goBack}
        />

        <ProfileHeaderButton
          imageSrc={cameraButton}
          style={styles.topButton}
          onPress={selectCoverPicture}
        />
      </View>

      <CreateAvatar
        avatar={profilePicBackground}
        handlePressEdit={selectProfilePicture}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbView}>
        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={onEditProfile}>
          {({setFieldValue, values, handleSubmit, errors}) => (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.card}>
                <View
                  style={styles.scrollContainer}
                  onStartShouldSetResponder={() => true}>
                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('nickname')}
                  </Typography.Subtitle2>
                  <DTextInput
                    style={styles.inputStyle}
                    inputRef={nicknameInputRef}
                    value={values.nickname}
                    placeholder={t('enterNickname')}
                    onChangeText={value => {
                      setFieldValue('nickname', value, true);
                    }}
                    error={!!errors.nickname}
                  />
                  {errors.nickname && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.nickname}
                    </Typography.Caption1>
                  )}
                  {nicknameInputRef.current && (
                    <View style={styles.nickname}>
                      <TextCounter
                        maxChar={profileParams.nickname.maxLength}
                        textToCount={values?.nickname ?? ''}
                      />
                    </View>
                  )}

                  <>
                    <Typography.Subtitle2 style={styles.inputLabel}>
                      {t('dTag')}
                    </Typography.Subtitle2>
                    <DTextInput
                      style={styles.inputStyle}
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
                  {errors.dTag && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.dTag}
                    </Typography.Caption1>
                  )}
                  {dTagInputRef.current && (
                    <View style={styles.dTag}>
                      <TextCounter
                        maxChar={profileParams.dTag.maxLength}
                        textToCount={values?.dTag ?? ''}
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
                    inputStyle={styles.bioInput}
                    placeholder={t('addBio')}
                    onChangeText={value => {
                      setFieldValue('bio', value, true);
                    }}
                    error={!!errors.bio}
                    style={styles.bioDTextInput}
                  />
                  {errors.bio && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.bio}
                    </Typography.Caption1>
                  )}
                  {bioInputRef.current && (
                    <View style={styles.bio}>
                      <TextCounter
                        maxChar={profileParams.bio.maxLength}
                        textToCount={values?.bio ?? ''}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
              <View style={{padding: theme.spacing.m}}>
                <Button
                  disabled={!values.dTag}
                  color={theme.colors.surfaceBlack}
                  mode="contained"
                  onPress={handleSubmit}>
                  {t('common:confirm')}
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default SaveProfile;
