import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
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
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC} from 'react';
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
import CreateAvatar from 'screens/CreateDesmosProfile/components/CreateAvatar';
import useStyles from './useStyles';
import useHooks from './useHooks';
import useHandleFormSubmit from './useHandleFormSubmit';
import useHandleAddProfileSubmit from './useHandleAddProfileSubmit';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_DESMOS_PROFILE
>;

const CreateDesmosProfile: FC<NavProps> = () => {
  const theme = useTheme();
  const {t} = useTranslation('createProfile');
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const {
    signUpInfo,
    setNickname,
    setBio,
    fromSignUp,
    coverPicture,
    selectCoverPicture,
    profilePicture,
    selectProfilePicture,
    loading,
    setLoading,
    profileParams,
    nicknameInputRef,
    dTagInputRef,
    bioInputRef,
    scrollViewRef,
    nicknameMaxLength,
    validationSchema,
    initialFormState,
    accountCreation,
    createLedgerAccount,
  } = useHooks();

  const handleFormSubmit = useHandleFormSubmit(
    initialFormState,
    setLoading,
    profilePicture,
    coverPicture,
    accountCreation,
    createLedgerAccount,
  );
  const handleAddProfileSubmit = useHandleAddProfileSubmit(
    initialFormState,
    setLoading,
    profilePicture,
    coverPicture,
    accountCreation,
    createLedgerAccount,
  );

  const styles = useStyles({nicknameInputRef, dTagInputRef, bioInputRef});

  const isAddingProfile =
    ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED ===
      (accountCreation?.source ?? createLedgerAccount?.source) ||
    ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL ===
      (accountCreation?.source ?? createLedgerAccount?.source);

  const submitHandler = isAddingProfile
    ? handleAddProfileSubmit
    : handleFormSubmit;

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
        <ProfileHeaderButton
          imageSrc={backButton}
          onPress={navigation.goBack}
        />

        <ProfileHeaderButton
          imageSrc={cameraButton}
          style={styles.topButton}
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
        style={styles.kbView}>
        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={submitHandler}>
          {({setFieldValue, values, handleSubmit, errors}) => (
            <>
              <View style={styles.header}>
                <Typography.H4>{t('header')}</Typography.H4>
                <Typography.Body6 style={styles.descriptionText}>
                  {t('description')}
                </Typography.Body6>
              </View>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.card}>
                <View style={styles.scrollContainer}>
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
                      fromSignUp && setNickname(value);
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
                  )}
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
                      fromSignUp && setBio(value);
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
                  disabled={
                    isAddingProfile ? !values.dTag || !!errors.dTag : false
                  }
                  color={theme.colors.surfaceBlack}
                  mode="contained"
                  onPress={fromSignUp ? navigation.goBack : handleSubmit}
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

export default CreateDesmosProfile;
