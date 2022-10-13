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
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import CreateAvatar from 'screens/CreateDesmosProfile/components/CreateAvatar';
import useHooks from './useHooks';
import useStyles from './useStyles';

const EditProfile = () => {
  const theme = useTheme();
  const {t} = useTranslation('createProfile');
  const {
    profileParams,
    validationSchema,
    initialFormState,
    onEditProfile,
    profilePictureUri,
    coverPictureUri,
    selectProfilePicture,
    selectCoverPicture,
    loading,
    goBack,
  } = useHooks();
  const nicknameInputRef = useRef<TextInput>(null);
  const dTagInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = useStyles({nicknameInputRef, dTagInputRef, bioInputRef});
  return (
    <DView
      showLoadingOverlay={loading}
      style={styles.container}
      backgroundImage={coverPictureUri ? {uri: coverPictureUri} : defaultBanner}
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
        avatar={
          profilePictureUri ? {uri: profilePictureUri} : defaultProfilePic
        }
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
                        maxChar={profileParams.nickname.max_length}
                        textToCount={values.nickname}
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
                        maxChar={profileParams.bio.max_length}
                        textToCount={values.bio}
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

export default EditProfile;
