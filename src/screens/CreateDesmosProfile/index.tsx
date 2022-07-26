import React from 'react';
import DView from 'components/DView';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {backButton, cameraButton, createProfileBanner} from 'assets/images';
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

  const {goBack} = useNavigation<NavProp['navigation']>();

  const profileParams = useRecoilValue(profileParamsState);

  const nicknameInputRef = React.useRef<any>();

  const dTagInputRef = React.useRef<any>();
  const bioInputRef = React.useRef<any>();

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(parseInt(profileParams.nickname.min_length, 10), '')
        .max(parseInt(profileParams.nickname.max_length, 10), ''),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(parseInt(profileParams.dtag.min_length, 10), '')
        .max(parseInt(profileParams.dtag.max_length, 10), '')
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
          numChars: parseInt(profileParams.bio.max_length),
        }),
      ),
    });
  }, [profileParams]);

  const handleFormSubmit = React.useCallback(
    (values: typeof initialFormState) => {
      console.log(values);
    },
    [],
  );

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white}>
      <Image source={createProfileBanner} style={styles.bannerImage} />

      <View style={styles.headerButtonGroup}>
        <ProfileHeaderButton imageSrc={backButton} onPress={goBack} />

        <ProfileHeaderButton
          imageSrc={cameraButton}
          style={styles.cameraButton}
        />
      </View>

      <CreateAvatar handlePressEdit={() => {}} />
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
                <View style={{opacity: nicknameInputRef.current.isFocused()}}>
                  <TextCounter
                    maxChar={parseInt(profileParams.nickname.max_length, 10)}
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
                <View style={{opacity: dTagInputRef.current.isFocused()}}>
                  <TextCounter
                    maxChar={parseInt(profileParams.dtag.max_length, 10)}
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
                <View style={{opacity: bioInputRef.current.isFocused()}}>
                  <TextCounter
                    maxChar={parseInt(profileParams.bio.max_length, 10)}
                    textToCount={values.bio}
                  />
                </View>
              )}

              <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 200}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <Button mode="gradientFilled" onPress={handleSubmit}>
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
