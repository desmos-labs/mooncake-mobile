import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {checkBlackIcon, twitterIcon} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type ConnectAppParams = {
  mode: 'connect' | 'tweet';
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_APP>;

const ConnectApp = () => {
  const styles = useStyles();
  const {t} = useTranslation('connectApp');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [loading, setLoading] = useState(false);
  const [twitted, setTwitted] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

  const handleUnlockWallet = useCallback(async () => {
    console.log('unlockWallet');
    if (chainAccount) {
      const unlockResult = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {titleLabelOverride: t('proof')},
      });
      if (unlockResult) {
        navigate(ROUTES.CONNECT_APP, {
          mode: 'tweet',
        });
      }
    }
  }, [chainAccount, unlockWallet]);

  const handleSelectTweet = useCallback(() => {
    navigate(ROUTES.SELECT_TWEET, {username: twitterUsername});
  }, []);

  const handleOnPress = useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('proof'),
      subtitle: t('proof description'),
      primaryButtonLabel: 'confirm',
      onPressPrimary: handleUnlockWallet,
      removeModalAfterButtonPress: true,
    });
  }, [handleUnlockWallet]);

  const openTwitterApp = useCallback(() => {
    setLoading(true);
    Linking.openURL('twitter://post?message=hello%20world')
      .catch(() => {
        Linking.openURL(
          'https://twitter.com/compose/tweet?message=hello%20world',
        );
      })
      .finally(() => {
        setTimeout(() => {
          setTwitted(true);
          setLoading(false);
        }, 1000);
      });
  }, [twitted]);

  return (
    <DView
      topBar={<TopBar />}
      style={styles.container}
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
              onChangeText={text => setTwitterUsername(text)}
            />
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Button
              disabled={!twitterUsername}
              mode="contained"
              color={theme.colors.surfaceBlack}
              loading={loading}
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
              <Typography.Body5
                selectable={true}
                selectionColor={theme.colors.butterOrange01}>
                I am linking my Twitter account with #Butter:
                https://butter-social/proof/1eb5ba6aa47439b5395bf66523298221
              </Typography.Body5>
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
            loading={loading}
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
