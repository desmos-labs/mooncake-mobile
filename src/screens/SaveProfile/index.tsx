import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { backButton, defaultBanner, defaultProfilePic, editProfilePic } from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import TextCounter from 'components/TextCounter';
import { CameraType } from 'expo-image-picker';
import { Formik } from 'formik';
import useTakePicture, { TakePictureActionResults } from 'hooks/camera/useTakePicture';
import useProfileParams from 'hooks/profiles/useProfileParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import useStyles from 'screens/SaveProfile/useStyles';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile } from 'types/desmos';
import CreateAvatar from './components/CreateAvatar';
import {
  SaveProfileFormState,
  useGetImageBackground,
  useInitialFormState,
  useSubmitForm,
  useValidationSchema,
} from './hooks';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SAVE_PROFILE>;

/**
 * Optional that can be passed when navigating to this screen.
 */
export interface SaveProfileParams {
  /**
   * Optional profile that should be edited.
   * If this is not provided, a new profile will be created instead.
   */
  readonly profile?: DesmosProfile;
  /**
   * Optional account that can be used to sign the transaction while saving the profile.
   * If this is not provided, the current account will be used instead.
   */
  readonly accountWithWallet?: AccountWithWallet;
  /**
   * Callback that will be called when the profile has been saved.
   */
  readonly onProfileSaved: () => void;
  /**
   * Optional custom transaction header that will be used to sign the transaction.
   */
  readonly customTransactionHeader?: string;
  /**
   * Optional custom transaction body that will be used to sign the transaction.
   */
  readonly customTransactionBody?: string;
  /**
   * If true the user wil not be able to go back from this screen.
   */
  readonly blockBackAction?: boolean;
}

/**
 * Screen that allows to either edit a given Desmos profile, or create a new one.
 * @constructor
 */
const SaveProfile = (props: NavProps) => {
  const theme = useTheme();
  const { t } = useTranslation('createProfile');

  const { goBack, navigate } = useNavigation<NavProps['navigation']>();
  const { route } = props;
  const { params } = route;

  const profile = params?.profile;
  const accountWithWallet = params?.accountWithWallet;
  const customTransactionHeader = params?.customTransactionHeader;
  const customTransactionBody = params?.customTransactionBody;
  const onProfileSaved = params?.onProfileSaved || (() => {});
  const onCompleteOrError = () => {};

  // -------------------------------------------------------------------------------------
  // --- Styles
  // -------------------------------------------------------------------------------------

  const nicknameInputRef = useRef<TextInput>(null);
  const dTagInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = useStyles({ nicknameInputRef, dTagInputRef, bioInputRef });

  // -------------------------------------------------------------------------------------
  // --- Screen state
  // -------------------------------------------------------------------------------------

  const [profilePic, setProfilePic] = useState(profile?.profilePicture);
  const profilePicBackground = useGetImageBackground(
    profilePic,
    profile?.profilePicture,
    defaultProfilePic,
  );
  const [coverPic, setCoverPic] = useState(profile?.coverPicture);
  const coverPictureBackground = useGetImageBackground(
    coverPic,
    profile?.coverPicture,
    defaultBanner,
  );

  // -------------------------------------------------------------------------------------
  // --- Form validation
  // -------------------------------------------------------------------------------------

  // Validation params
  const { params: profileParams } = useProfileParams();

  const initialFormState = useInitialFormState(profile);
  const validationSchema = useValidationSchema(profileParams);

  // -------------------------------------------------------------------------------------
  // --- Callbacks
  // -------------------------------------------------------------------------------------

  // Image selection actions
  const { imageFromLibrary: selectCoverPicture } = useImageFromDevice({
    onImageSelected: imageUri => setCoverPic(imageUri),
  });
  const { imageFromLibrary: selectProfilePicture } = useImageFromDevice({
    onImageSelected: imageUri => setProfilePic(imageUri),
  });
  const { editProfilePicture, editCoverPicture } = useOpenPictureEditor();
  const takePhoto = useTakePicture();

  const handleSelectProfilePicture = useCallback(async () => {
    navigate(ROUTES.SELECT_IMAGE_MODAL, {
      onPressSelectImage: () =>
        selectProfilePicture().then(res => {
          if (res) {
            editProfilePicture(res, setProfilePic);
          }
        }),
      onPressTakePhoto: () =>
        takePhoto(CameraType.front).then(result => {
          if (result?.status === TakePictureActionResults.Taken) {
            const imageUri = result.uri;
            editProfilePicture(imageUri, setProfilePic);
          }
        }),
    });
  }, [editProfilePicture, navigate, selectProfilePicture, takePhoto]);

  const handleSelectCoverPicture = useCallback(() => {
    navigate(ROUTES.SELECT_IMAGE_MODAL, {
      onPressSelectImage: () =>
        selectCoverPicture().then(res => {
          if (res) {
            editCoverPicture(res, setCoverPic);
          }
        }),
      onPressTakePhoto: () =>
        takePhoto().then(result => {
          if (result?.status === TakePictureActionResults.Taken) {
            const imageUri = result.uri;
            editCoverPicture(imageUri, setCoverPic);
          }
        }),
    });
  }, [editCoverPicture, navigate, selectCoverPicture, takePhoto]);

  // Hook to submit the form and check the status of the profile saving.
  const submitForm = useSubmitForm(
    profile,
    accountWithWallet,
    onProfileSaved,
    onCompleteOrError,
    customTransactionHeader,
    customTransactionBody,
  );

  // Callback used when the user presses the Save button.
  const onSaveProfile = useCallback(
    async (values: SaveProfileFormState) => {
      InteractionManager.runAfterInteractions(async () => {
        await submitForm(values, profilePic, coverPic);
        goBack();
      });
    },
    [coverPic, profilePic, submitForm],
  );

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      style={styles.container}
      backgroundImage={coverPictureBackground}
      backgroundColor={theme.colors.white}>
      <View style={styles.headerButtonGroup}>
        <ProfileHeaderButton image={backButton} style={styles.topButton} onPress={goBack} />
        <ProfileHeaderButton
          image={editProfilePic}
          style={styles.topButton}
          onPress={handleSelectCoverPicture}
        />
      </View>
      <CreateAvatar avatar={profilePicBackground} handlePressEdit={handleSelectProfilePicture} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbView}>
        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={onSaveProfile}>
          {({ setFieldValue, values, handleSubmit, errors }) => (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.card}>
                <View style={styles.scrollContainer} onStartShouldSetResponder={() => true}>
                  <Typography.Semibold16 style={styles.inputLabel}>
                    {t('nickname')}
                  </Typography.Semibold16>
                  <DTextInput
                    style={styles.inputStyle}
                    inputRef={nicknameInputRef}
                    value={values.nickname}
                    placeholder={t('enter nickname')}
                    onChangeText={value => {
                      setFieldValue('nickname', value, true);
                    }}
                    error={!!errors.nickname}
                  />
                  {errors.nickname && (
                    <Typography.Regular12 style={styles.errorText}>
                      {errors.nickname}
                    </Typography.Regular12>
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
                    <Typography.Semibold16 style={styles.inputLabel}>
                      {t('dtag')}
                    </Typography.Semibold16>
                    <DTextInput
                      style={styles.inputStyle}
                      value={values.dTag}
                      placeholder={t('enter dtag')}
                      onChangeText={value => {
                        setFieldValue('dTag', value, true);
                      }}
                      error={!!errors.dTag}
                      inputRef={dTagInputRef}
                      autoCapitalize="none"
                    />
                  </>
                  {errors.dTag && (
                    <Typography.Regular12 style={styles.errorText}>
                      {errors.dTag}
                    </Typography.Regular12>
                  )}
                  {dTagInputRef.current && (
                    <View style={styles.dTag}>
                      <TextCounter
                        maxChar={profileParams.dTag.maxLength}
                        textToCount={values?.dTag ?? ''}
                      />
                    </View>
                  )}
                  <Typography.Semibold16 style={styles.inputLabel}>
                    {t('bio')}
                  </Typography.Semibold16>
                  <DTextInput
                    onFocus={() => {
                      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 500);
                    }}
                    inputRef={bioInputRef}
                    value={values.bio}
                    multiline={true}
                    scrollEnabled={true}
                    inputStyle={styles.bioInput}
                    placeholder={t('add bio')}
                    onChangeText={value => {
                      setFieldValue('bio', value, true);
                    }}
                    error={!!errors.bio}
                    style={styles.bioDTextInput}
                  />
                  {errors.bio && (
                    <Typography.Regular12 style={styles.errorText}>
                      {errors.bio}
                    </Typography.Regular12>
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
              <View style={{ padding: theme.spacing.m }}>
                <Button
                  disabled={!values.dTag}
                  textColor={theme.colors.white}
                  backgroundColor={theme.colors.surfaceBlack}
                  size={44}
                  onPress={handleSubmit as any}>
                  {t('confirm', { ns: 'common' })}
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
