import {checkBlackIcon, twitterIcon} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, KeyboardAvoidingView, Platform, View} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import useHooks from './useHooks';
import useStyles from './useStyles';

const ConnectApp = () => {
  const styles = useStyles();
  const {t} = useTranslation('connectApp');
  const theme = useTheme();
  const {
    mode,
    generatingProof,
    proofString,
    openingTwitterApp,
    handleOnPress,
    handleSelectTweet,
    twitterUsername,
    openTwitterApp,
    setTwitterUsername,
    twitted,
    checkingUsername,
    checkTwitterUsername,
    twitterUsernameExisting,
  } = useHooks();

  return (
    <DView
      topBar={<TopBar />}
      style={styles.container}
      showLoadingOverlay={generatingProof}
      backgroundColor={theme.colors.white}>
      {mode === 'connect' ? (
        <>
          <View style={{flex: 1}}>
            <Spacer paddingVertical={theme.spacing.m}>
              <Image source={twitterIcon} style={styles.image} />
            </Spacer>
            <Typography.Subtitle2>{t('twitter username')}</Typography.Subtitle2>
            <DTextInput
              autoCapitalize="none"
              placeholder={t('username')}
              style={styles.input}
              value={twitterUsername}
              onChangeText={text => {
                setTwitterUsername(text);
                checkTwitterUsername(text);
              }}
            />
            <Spacer paddingVertical={6} />
            {checkingUsername ? (
              <ActivityIndicator
                style={{alignSelf: 'flex-start', marginLeft: 6}}
              />
            ) : (
              <Typography.Body6
                style={
                  twitterUsernameExisting
                    ? {color: theme.colors.accentGreen01}
                    : {color: theme.colors.pink01}
                }>
                {twitterUsernameExisting ? t('valid') : t('invalid')}
              </Typography.Body6>
            )}
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Button
              disabled={!twitterUsername}
              mode="contained"
              color={theme.colors.surfaceBlack}
              loading={openingTwitterApp}
              onPress={handleOnPress}
              style={styles.button}>
              <Typography.Button2 style={{color: theme.colors.white}}>
                {t('common:next')}
              </Typography.Button2>
            </Button>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <View style={{flex: 1}}>
            <Spacer paddingVertical={theme.spacing.m}>
              <Image source={twitterIcon} style={styles.image} />
            </Spacer>
            <View style={{alignSelf: 'center'}}>
              <Typography.Subtitle2 style={{alignSelf: 'center'}}>
                {twitterUsername}
              </Typography.Subtitle2>
              <Typography.Body6
                style={{color: theme.colors.grey02, alignSelf: 'center'}}>
                @twitter
              </Typography.Body6>
            </View>
            <Spacer paddingVertical={theme.spacing.m} />
            <Typography.Body5>{t('tweet content')}</Typography.Body5>
            <View style={styles.tweetContent}>
              {proofString ? (
                <Typography.Body5
                  selectable={true}
                  selectionColor={theme.colors.butterOrange01}>
                  {t('link proof')} {proofString}
                </Typography.Body5>
              ) : (
                <Typography.Body5>Generating proof...</Typography.Body5>
              )}
            </View>
          </View>
          {twitted && (
            <View style={styles.tweetBadge}>
              <Typography.Button2>{t('tweet made')}</Typography.Button2>
              <Image
                source={checkBlackIcon}
                style={{width: 24, height: 24, marginLeft: 2}}
              />
            </View>
          )}
          <Button
            disabled={!twitterUsername}
            mode="contained"
            color={theme.colors.surfaceBlack}
            loading={openingTwitterApp}
            onPress={twitted ? handleSelectTweet : openTwitterApp}
            style={styles.button}>
            <Typography.Button2 style={{color: theme.colors.white}}>
              {twitted ? t('common:next') : t('tweet it now')}
            </Typography.Button2>
          </Button>
        </>
      )}
    </DView>
  );
};

export default ConnectApp;
